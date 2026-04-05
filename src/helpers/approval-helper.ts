import { PrismaClient } from "@prisma/client";
import { generateLoanSchedule, computeMaturityDate } from "@/helpers/loan-calculations";
import { createDisbursementEntries, syncLoanPortfolio, DisbursementAccounts } from "@/helpers/accounting-functions";

/**
 * approval-helper.ts
 *
 * Translates a PendingApproval.actionData JSON payload into real database mutations.
 * Called exclusively by POST /api/approvals/[id]/approve.
 */

export interface ExecutionResult {
  entityType: string;
  entityId: number;
  data: Record<string, unknown>;
}

/**
 * Execute an approved action.
 * Reads the approval record, applies the payload, posts accounting entries.
 *
 * @returns ExecutionResult with the created/updated entity
 */
export async function executeApproval(
  prisma: PrismaClient,
  approvalId: number,
  reviewedBy: string,
  disbursementAccounts?: DisbursementAccounts
): Promise<ExecutionResult> {
  const approval = await prisma.pendingApproval.findUnique({
    where: { approvalId },
  });

  if (!approval) throw new Error("Approval not found.");
  if (approval.status !== "pending") throw new Error("Approval already actioned.");

  const payload = JSON.parse(approval.actionData) as Record<string, unknown>;

  let result: ExecutionResult;

  switch (approval.actionType) {
    case "CREATE_LOAN":
      result = await executeLoanCreation(prisma, payload, disbursementAccounts);
      break;
    case "EDIT_LOAN":
      result = await executeLoanEdit(prisma, approval.entityId!, payload);
      break;
    case "DELETE_LOAN":
      result = await executeLoanDelete(prisma, approval.entityId!);
      break;
    case "DEACTIVATE_ACCOUNT":
      result = await executeAccountDeactivation(prisma, approval.entityId!, payload);
      break;
    case "CREATE_CUSTOMER":
      result = await executeCustomerCreation(prisma, payload);
      break;
    case "EDIT_CUSTOMER":
      result = await executeCustomerEdit(prisma, approval.entityId!, payload);
      break;
    case "WRITE_OFF":
      result = await executeLoanWriteOff(prisma, approval.entityId!, payload);
      break;
    default:
      throw new Error(`Unknown actionType: ${approval.actionType}`);
  }

  // Mark approval as approved
  await prisma.pendingApproval.update({
    where: { approvalId },
    data: {
      status:      "approved",
      reviewedBy,
      reviewedAt:  new Date(),
    },
  });

  return result;
}

// ─── Loan creation execution ──────────────────────────────────────────────────

async function executeLoanCreation(
  prisma: PrismaClient,
  payload: Record<string, unknown>,
  disbursementAccounts?: DisbursementAccounts
): Promise<ExecutionResult> {
  const loanId = payload.loanId as number;

  // Generate and persist the instalment schedule
  const loan = await prisma.loanPortfolio.findUniqueOrThrow({ where: { loanId } });

  const schedule = generateLoanSchedule({
    loanAmount:           Number(loan.loanAmount),
    interestRate:         Number(loan.interestRate),
    numberOfInstalments:  loan.numberOfInstalments,
    managementFeeRate:    Number(loan.managementFeeRate),
    deductFeeUpfront:     loan.deductFeeUpfront,
    firstPaymentDate:     loan.firstPaymentDate.toISOString().split("T")[0],
  });

  // Persist instalment rows
  for (const row of schedule.instalments) {
    await prisma.loanInstalment.create({
      data: {
        loanId,
        loanNumber:      loan.loanNumber,
        instalmentNumber: row.instalmentNumber,
        dueDate:         new Date(row.dueDate),
        openingBalance:  row.openingBalance,
        closingBalance:  row.closingBalance,
        principalAmount: row.principalAmount,
        interestAmount:  row.interestAmount,
        managementFee:   row.managementFee,
        totalPayment:    row.totalPayment,
        balanceRemaining: row.totalPayment,
        status:          "Pending",
        createdBy:       loan.createdBy,
      },
    });
  }

  // Activate the loan
  const approvedLoan = await prisma.loanPortfolio.update({
    where: { loanId },
    data: {
      loanStatus:           "Active",
      totalInterest:        schedule.summary.totalInterest,
      totalManagementFees:  schedule.summary.totalManagementFees,
      totalPayment:         schedule.summary.totalPayment,
      monthlyPayment:       schedule.summary.monthlyPayment,
      totalDisbursed:       schedule.summary.totalDisbursed,
      managementFeeAmount:  schedule.summary.managementFeeAmount,
      principalOutstanding: schedule.summary.totalDisbursed,
      totalOutstanding:     schedule.summary.totalDisbursed,
    },
  });

  // Post disbursement transaction log
  await prisma.loanTransaction.create({
    data: {
      loanId,
      loanNumber:      loan.loanNumber,
      transactionType: "Disbursement",
      transactionDate: loan.disbursementDate,
      amount:          loan.totalDisbursed,
      description:     "Loan disbursed",
      createdBy:       loan.createdBy,
    },
  });

  // Post ledger entries if accounts are provided
  if (disbursementAccounts) {
    await createDisbursementEntries(prisma, {
      loanId,
      loanAmount:           Number(loan.loanAmount),
      totalDisbursed:       Number(loan.totalDisbursed),
      managementFeeAmount:  Number(loan.managementFeeAmount),
      deductFeeUpfront:     loan.deductFeeUpfront,
      disbursementDate:     loan.disbursementDate,
      createdBy:            loan.createdBy,
    }, disbursementAccounts);
  }

  return { entityType: "loan", entityId: loanId, data: approvedLoan as unknown as Record<string, unknown> };
}

// ─── Loan edit execution ──────────────────────────────────────────────────────

async function executeLoanEdit(
  prisma: PrismaClient,
  loanId: number,
  payload: Record<string, unknown>
): Promise<ExecutionResult> {
  const { loanAmount, interestRate, numberOfInstalments, disbursementDate, firstPaymentDate } = payload as {
    loanAmount?: number;
    interestRate?: number;
    numberOfInstalments?: number;
    disbursementDate?: string;
    firstPaymentDate?: string;
  };

  const updated = await prisma.loanPortfolio.update({
    where: { loanId },
    data: {
      ...(loanAmount          !== undefined ? { loanAmount }         : {}),
      ...(interestRate        !== undefined ? { interestRate }       : {}),
      ...(numberOfInstalments !== undefined ? { numberOfInstalments }: {}),
      ...(disbursementDate    !== undefined ? { disbursementDate: new Date(disbursementDate) } : {}),
      ...(firstPaymentDate    !== undefined ? { firstPaymentDate:   new Date(firstPaymentDate),
                                                 maturityDate: new Date(
                                                   computeMaturityDate(firstPaymentDate, numberOfInstalments ?? 1)
                                                 ) } : {}),
    },
  });

  return { entityType: "loan", entityId: loanId, data: updated as unknown as Record<string, unknown> };
}

// ─── Loan delete/reject execution ─────────────────────────────────────────────

async function executeLoanDelete(
  prisma: PrismaClient,
  loanId: number
): Promise<ExecutionResult> {
  const updated = await prisma.loanPortfolio.update({
    where: { loanId },
    data: { loanStatus: "Rejected" },
  });
  return { entityType: "loan", entityId: loanId, data: updated as unknown as Record<string, unknown> };
}

// ─── Write-off execution ──────────────────────────────────────────────────────

async function executeLoanWriteOff(
  prisma: PrismaClient,
  loanId: number,
  payload: Record<string, unknown>
): Promise<ExecutionResult> {
  const updated = await prisma.loanPortfolio.update({
    where: { loanId },
    data: {
      loanStatus:     "Written_Off",
      writeOffReason: payload.reason as string,
      writeOffDate:   payload.writeOffDate ? new Date(payload.writeOffDate as string) : new Date(),
    },
  });
  // Sync outstanding balances
  await syncLoanPortfolio(prisma, loanId);
  return { entityType: "loan", entityId: loanId, data: updated as unknown as Record<string, unknown> };
}

// ─── Customer creation execution ──────────────────────────────────────────────

async function executeCustomerCreation(
  prisma: PrismaClient,
  payload: Record<string, unknown>
): Promise<ExecutionResult> {
  // Customer should already exist with a draft status; update to Active
  const customerId = payload.customerId as number;
  const updated = await prisma.customer.update({
    where: { customerId },
    data: { status: "Active" },
  });
  return { entityType: "customer", entityId: customerId, data: updated as unknown as Record<string, unknown> };
}

// ─── Customer edit execution ──────────────────────────────────────────────────

async function executeCustomerEdit(
  prisma: PrismaClient,
  customerId: number,
  payload: Record<string, unknown>
): Promise<ExecutionResult> {
  // Apply only the fields present in the payload snapshot
  const allowedFields = [
    "customerName", "phone", "email", "address", "accountNumber",
    "idNumber", "occupation", "gender", "dateOfBirth", "province",
  ];
  const updateData: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (payload[field] !== undefined) updateData[field] = payload[field];
  }

  const updated = await prisma.customer.update({
    where: { customerId },
    data: updateData,
  });
  return { entityType: "customer", entityId: customerId, data: updated as unknown as Record<string, unknown> };
}

// ─── Account deactivation execution ───────────────────────────────────────────

async function executeAccountDeactivation(
  prisma: PrismaClient,
  accountId: number,
  payload: Record<string, unknown>
): Promise<ExecutionResult> {
  const updated = await prisma.chartOfAccount.update({
    where: { accountId },
    data: { isActive: false },
  });
  return { entityType: "account", entityId: accountId, data: updated as unknown as Record<string, unknown> };
}
