/**
 * accounting-functions.ts
 *
 * All account codes are resolved dynamically from the ChartOfAccount table.
 * No account codes are hardcoded here. Callers supply the relevant codes
 * (from user input, loan data, or a prior DB lookup) and this module
 * validates they exist, builds balanced lines, posts journal entries, and
 * refreshes portfolio totals.
 */

import { PrismaClient, Prisma } from "@prisma/client";
import { VoucherService } from "@/services/voucher.service";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JournalLineInput {
  /** Must exist in chart_of_accounts */
  accountCode: string;
  particular: string;
  narration?: string;
  debitAmount: number;
  creditAmount: number;
  referenceType?: string;
  referenceId?: string;
  createdBy?: number;
}

export interface DisbursementAccounts {
  /** Account to credit cash/bank from (e.g. Cash, Bank — Zenith, Bank — GTB) */
  cashAccountCode: string;
  /** Loan asset account to debit (e.g. Loans to Customers) */
  loanAssetAccountCode: string;
  /** Revenue account for upfront fee (e.g. Upfront Fee Income) — required when deductFeeUpfront=true */
  upfrontFeeAccountCode?: string;
  /** VAT payable account — optional, only used when fee income includes VAT */
  vatPayableAccountCode?: string;
}

export interface PaymentAccounts {
  /** Account to debit for cash receipt (Cash / Bank) */
  cashAccountCode: string;
  /** Loan asset account to credit for principal repayment */
  loanAssetAccountCode: string;
  /** Interest income account to credit */
  interestIncomeAccountCode: string;
  /** Management fee income account to credit — omit when fee = 0 */
  mgmtFeeAccountCode?: string;
  /** Penalty income account to credit — omit when penalty = 0 */
  penaltyAccountCode?: string;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Resolve account name & class from the DB. Throws if the code does not exist or is inactive.
 */
async function resolveAccount(
  prisma: PrismaClient | Prisma.TransactionClient,
  code: string
): Promise<{ accountCode: string; accountName: string; class: string; normalBalance: string }> {
  const acct = await (prisma as PrismaClient).chartOfAccount.findUnique({
    where: { accountCode: code },
  });
  if (!acct) throw new Error(`GL account "${code}" not found in chart_of_accounts.`);
  if (!acct.isActive) throw new Error(`GL account "${code}" is inactive.`);
  return {
    accountCode:   acct.accountCode,
    accountName:   acct.accountName,
    class:         acct.class,
    normalBalance: acct.normalBalance ?? "Debit",
  };
}

/**
 * Compute the running ending balance for a ledger line.
 * Uses the last posted entry for the account to determine opening balance.
 */
async function computeEndingBalance(
  prisma: PrismaClient | Prisma.TransactionClient,
  accountCode: string,
  debitAmount: number,
  creditAmount: number,
  normalBalance: string
): Promise<{ beginning: number; ending: number; sequenceNumber: number }> {
  const lastEntry = await (prisma as PrismaClient).ledger.findFirst({
    where: { accountCode },
    orderBy: [{ transactionDate: "desc" }, { sequenceNumber: "desc" }],
  });

  const beginning = lastEntry ? Number(lastEntry.endingBalance) : 0;
  const movement =
    normalBalance === "Debit"
      ? debitAmount - creditAmount
      : creditAmount - debitAmount;

  return {
    beginning,
    ending: beginning + movement,
    sequenceNumber: (lastEntry?.sequenceNumber ?? 0) + 1,
  };
}

// ─── Core journal entry poster ─────────────────────────────────────────────────

/**
 * Post a balanced set of ledger lines and create a JournalEntry header.
 * Throws if debits ≠ credits or any account code is invalid.
 *
 * @returns The created journal entry ID
 */
export async function createJournalEntry(
  prisma: PrismaClient | Prisma.TransactionClient,
  date: Date,
  description: string,
  lines: JournalLineInput[],
  reference?: string,
  createdBy?: number
): Promise<number> {
  // ── 1. Validate balance ──────────────────────────────────────────────────────
  const totalDebit  = lines.reduce((s, l) => s + l.debitAmount,  0);
  const totalCredit = lines.reduce((s, l) => s + l.creditAmount, 0);
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(
      `Unbalanced journal entry: total debits ${totalDebit} ≠ total credits ${totalCredit}`
    );
  }
  if (lines.length < 2) {
    throw new Error("A journal entry requires at least 2 lines.");
  }

  // Generate a voucher number for this journal entry
  const voucherNumber = await VoucherService.generateVoucherNumber(date);

  // ── 2. Create JournalEntry header ────────────────────────────────────────────
  const journal = await (prisma as any).journalEntry.create({
    data: { date, description, reference, createdBy },
  });

  // ── 3. Post each ledger line ─────────────────────────────────────────────────
  for (const line of lines) {
    const acct = await resolveAccount(prisma, line.accountCode);
    const { beginning, ending, sequenceNumber } = await computeEndingBalance(
      prisma,
      line.accountCode,
      line.debitAmount,
      line.creditAmount,
      acct.normalBalance
    );

    await (prisma as PrismaClient).ledger.create({
      data: {
        transactionDate:  date,
        class:            acct.class,
        accountCode:      line.accountCode,
        accountName:      acct.accountName,
        particular:       line.particular,
        narration:        line.narration,
        voucherNumber:    voucherNumber, // Standardized voucher
        beginningBalance: beginning,
        debitAmount:      line.debitAmount,
        creditAmount:     line.creditAmount,
        movement:         line.debitAmount - line.creditAmount,
        endingBalance:    ending,
        referenceType:    line.referenceType,
        referenceId:      line.referenceId,
        journalEntryId:   (journal as any).id,
        createdBy:        line.createdBy ?? createdBy,
        sequenceNumber,
      },
    });
  }

  return journal.id;
}

// ─── Disbursement entries (Appendix B.1) ─────────────────────────────────────

/**
 * Post loan disbursement journal entries.
 * Account codes are provided by the caller — never hardcoded here.
 *
 * DR  loanAssetAccountCode          loanAmount
 *   CR  cashAccountCode               totalDisbursed
 *   CR  upfrontFeeAccountCode         managementFeeAmount (net of VAT, if upfront)
 *   CR  vatPayableAccountCode         VAT on fee (7.5%)
 */
export async function createDisbursementEntries(
  prisma: PrismaClient,
  loan: {
    loanId: number;
    loanAmount: number;
    totalDisbursed: number;
    managementFeeAmount: number;
    deductFeeUpfront: boolean;
    disbursementDate: Date;
    createdBy?: number;
  },
  accounts: DisbursementAccounts
): Promise<number> {
  const vatRate = 0.075;
  const vatOnFee =
    loan.deductFeeUpfront && accounts.vatPayableAccountCode
      ? Math.round(loan.managementFeeAmount * vatRate)
      : 0;
  const netFee = loan.managementFeeAmount - vatOnFee;

  const lines: JournalLineInput[] = [
    {
      accountCode:   accounts.loanAssetAccountCode,
      particular:    `Loan Disbursement — Loan #${loan.loanId}`,
      debitAmount:   loan.loanAmount,
      creditAmount:  0,
      referenceType: "loan",
      referenceId:   String(loan.loanId),
      createdBy:     loan.createdBy,
    },
    {
      accountCode:   accounts.cashAccountCode,
      particular:    `Loan Disbursement — Loan #${loan.loanId}`,
      debitAmount:   0,
      creditAmount:  loan.totalDisbursed,
      referenceType: "loan",
      referenceId:   String(loan.loanId),
      createdBy:     loan.createdBy,
    },
  ];

  if (loan.deductFeeUpfront && loan.managementFeeAmount > 0 && accounts.upfrontFeeAccountCode) {
    lines.push({
      accountCode:   accounts.upfrontFeeAccountCode,
      particular:    `Upfront Management Fee — Loan #${loan.loanId}`,
      debitAmount:   0,
      creditAmount:  netFee,
      referenceType: "loan",
      referenceId:   String(loan.loanId),
    });

    if (vatOnFee > 0 && accounts.vatPayableAccountCode) {
      lines.push({
        accountCode:   accounts.vatPayableAccountCode,
        particular:    `VAT on Fee — Loan #${loan.loanId}`,
        debitAmount:   0,
        creditAmount:  vatOnFee,
        referenceType: "loan",
        referenceId:   String(loan.loanId),
      });
    }
  }

  return createJournalEntry(
    prisma,
    loan.disbursementDate,
    `Loan disbursement — Loan #${loan.loanId}`,
    lines,
    `LOAN-${loan.loanId}`,
    loan.createdBy
  );
}

// ─── Payment receipt entries (Appendix B.2) ───────────────────────────────────

/**
 * Post payment receipt journal entries.
 * Account codes are provided by the caller — never hardcoded.
 *
 * DR  cashAccountCode               paymentAmount
 *   CR  loanAssetAccountCode           principalAmount
 *   CR  interestIncomeAccountCode      interestAmount
 *   CR  mgmtFeeAccountCode             monitoringFee   (if > 0)
 *   CR  penaltyAccountCode             penalties       (if > 0)
 */
export async function createPaymentEntries(
  prisma: PrismaClient,
  payment: {
    paymentId: number;
    loanId: number;
    paymentDate: Date;
    paymentAmount: number;
    principalAmount: number;
    interestAmount: number;
    monitoringFee: number;
    penalties: number;
    createdBy?: number;
    isPrepayment?: boolean;
    reversedAt?: Date;
    createdAt: Date;
  },
  accounts: PaymentAccounts
): Promise<number> {
  const lines: JournalLineInput[] = [
    {
      accountCode:   accounts.cashAccountCode,
      particular:    `Payment Received — Loan #${payment.loanId}`,
      debitAmount:   payment.paymentAmount,
      creditAmount:  0,
      referenceType: "payment",
      referenceId:   String(payment.paymentId),
      createdBy:     payment.createdBy,
    },
    {
      accountCode:   accounts.loanAssetAccountCode,
      particular:    `Principal Repayment — Loan #${payment.loanId}`,
      debitAmount:   0,
      creditAmount:  payment.principalAmount,
      referenceType: "payment",
      referenceId:   String(payment.paymentId),
    },
    {
      accountCode:   accounts.interestIncomeAccountCode,
      particular:    `Interest Income — Loan #${payment.loanId}`,
      debitAmount:   0,
      creditAmount:  payment.interestAmount,
      referenceType: "payment",
      referenceId:   String(payment.paymentId),
    },
  ];

  if (payment.monitoringFee > 0 && accounts.mgmtFeeAccountCode) {
    lines.push({
      accountCode:   accounts.mgmtFeeAccountCode,
      particular:    `Management Fee — Loan #${payment.loanId}`,
      debitAmount:   0,
      creditAmount:  payment.monitoringFee,
      referenceType: "payment",
      referenceId:   String(payment.paymentId),
    });
  }

  if (payment.penalties > 0 && accounts.penaltyAccountCode) {
    lines.push({
      accountCode:   accounts.penaltyAccountCode,
      particular:    `Penalty — Loan #${payment.loanId}`,
      debitAmount:   0,
      creditAmount:  payment.penalties,
      referenceType: "payment",
      referenceId:   String(payment.paymentId),
    });
  }

  return createJournalEntry(
    prisma,
    payment.paymentDate,
    `Payment received — Loan #${payment.loanId}`,
    lines,
    `PAY-${payment.paymentId}`,
    payment.createdBy
  );
}

// ─── Reverse payment entries ──────────────────────────────────────────────────

/**
 * Reverse ledger entries associated with a payment reference.
 * Deletes all ledger rows for referenceType="payment" + referenceId=paymentId.
 */
export async function reversePaymentEntries(
  prisma: PrismaClient,
  paymentId: number
): Promise<void> {
  await prisma.ledger.deleteMany({
    where: { referenceType: "payment", referenceId: String(paymentId) },
  });
}

// ─── Expense entries ──────────────────────────────────────────────────────────

/**
 * Post expense journal entries.
 *
 * DR  expenseAccountCode    amount
 *   CR  paymentAccountCode    amount
 */
export async function createExpenseEntries(
  prisma: PrismaClient,
  expense: {
    expenseId: number;
    date: Date;
    amount: number;
    description: string;
    createdBy?: number;
  },
  accounts: {
    expenseAccountCode: string;
    paymentAccountCode: string;
  }
): Promise<number> {
  const lines: JournalLineInput[] = [
    {
      accountCode:   accounts.expenseAccountCode,
      particular:    `Expense — ${expense.description}`,
      debitAmount:   expense.amount,
      creditAmount:  0,
      referenceType: "expense",
      referenceId:   String(expense.expenseId),
      createdBy:     expense.createdBy,
    },
    {
      accountCode:   accounts.paymentAccountCode,
      particular:    `Expense Payment — ${expense.description}`,
      debitAmount:   0,
      creditAmount:  expense.amount,
      referenceType: "expense",
      referenceId:   String(expense.expenseId),
      createdBy:     expense.createdBy,
    },
  ];

  return createJournalEntry(
    prisma,
    expense.date,
    `Expense — ${expense.description}`,
    lines,
    `EXP-${expense.expenseId}`,
    expense.createdBy
  );
}

// ─── syncLoanPortfolio ────────────────────────────────────────────────────────

/**
 * Refresh LoanPortfolio aggregate totals by recomputing from all instalments.
 * Called after any payment, reversal, or schedule recalculation.
 */
export async function syncLoanPortfolio(
  prisma: PrismaClient,
  loanId: number
): Promise<void> {
  const instalments = await prisma.loanInstalment.findMany({ where: { loanId } });

  const principalOutstanding = instalments.reduce(
    (s, i) => s + Math.max(0, Number(i.principalAmount) - Number(i.principalPaid)), 0
  );
  const interestOutstanding = instalments.reduce(
    (s, i) => s + Math.max(0, Number(i.interestAmount) - Number(i.interestPaid)), 0
  );
  const totalOutstanding        = principalOutstanding + interestOutstanding;
  const totalPaid               = instalments.reduce((s, i) => s + Number(i.paidAmount), 0);
  const totalPrincipalPaid      = instalments.reduce((s, i) => s + Number(i.principalPaid), 0);
  const totalInterestPaid       = instalments.reduce((s, i) => s + Number(i.interestPaid), 0);
  const totalManagementFeesPaid = instalments.reduce((s, i) => s + Number(i.managementFeePaid), 0);

  const overdue = instalments.filter((i) => i.status === "Overdue");
  const daysOverdue = overdue.length > 0
    ? Math.max(...overdue.map((i) => i.daysOverdue))
    : 0;

  const allSettled = instalments.every(
    (i) => i.status === "Fully_Paid" || (i.status as string) === "Waived"
  );

  await prisma.loanPortfolio.update({
    where: { loanId },
    data: {
      principalOutstanding,
      interestOutstanding,
      totalOutstanding,
      totalPaid,
      totalPrincipalPaid,
      totalInterestPaid,
      totalManagementFeesPaid,
      daysOverdue,
      ...(allSettled ? { loanStatus: "Settled" } : {}),
    },
  });
}

// ─── Utility: fetch all active accounts as a lookup map ──────────────────────

/**
 * Returns a map of { accountCode → accountName } for all active GL accounts.
 * Useful for callers that need to validate or present account choices.
 */
export async function getActiveAccountsMap(
  prisma: PrismaClient
): Promise<Map<string, { name: string; type: string | null; normalBalance: string | null }>> {
  const accounts = await prisma.chartOfAccount.findMany({
    where: { isActive: true },
  });
  return new Map(
    accounts.map((a) => [
      a.accountCode,
      { name: a.accountName, type: a.accountType, normalBalance: a.normalBalance },
    ])
  );
}
