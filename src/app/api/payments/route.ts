import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, createdResponse, validationError, notFound, unprocessable, buildPaginationMeta } from "@/lib/api-response";
import { createPaymentEntries, syncLoanPortfolio, PaymentAccounts } from "@/helpers/accounting-functions";
import { calculateDaysOverdue } from "@/helpers/loan-calculations";
import { formatPayment } from "@/app/api/loans/[id]/route";

// GET /api/payments — paginated list with filters
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const loanId     = searchParams.get("loanId")     ? parseInt(searchParams.get("loanId")!)     : undefined;
  const customerId = searchParams.get("customerId") ? parseInt(searchParams.get("customerId")!) : undefined;
  const method     = searchParams.get("method") ?? undefined;
  const from       = searchParams.get("from")   ? new Date(searchParams.get("from")!) : undefined;
  const to         = searchParams.get("to")     ? new Date(searchParams.get("to")!)   : undefined;
  const page       = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage    = Math.min(100, parseInt(searchParams.get("perPage") ?? "25"));

  const where: Record<string, unknown> = {};
  if (loanId)     where.loanId     = loanId;
  if (customerId) where.customerId = customerId;
  if (method)     where.paymentMethod = method;
  if (from || to) where.paymentDate = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };

  const [total, payments] = await Promise.all([
    prisma.loanPayment.count({ where }),
    prisma.loanPayment.findMany({
      where,
      skip:    (page - 1) * perPage,
      take:    perPage,
      orderBy: { paymentDate: "desc" },
    }),
  ]);

  return successResponse(
    { payments: payments.map((p) => formatPayment(p as unknown as Record<string, unknown>)) },
    buildPaginationMeta(total, page, perPage)
  );
}) as unknown as (req: NextRequest) => Promise<Response>;

// POST /api/payments — record a new payment
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];
  if (!body.loanId)             errs.push({ field: "loanId",             issue: "Required" });
  if (!body.loanInstalmentId)   errs.push({ field: "loanInstalmentId",   issue: "Required" });
  if (!body.paymentDate)        errs.push({ field: "paymentDate",        issue: "Required" });
  if (body.paymentAmount === undefined) errs.push({ field: "paymentAmount", issue: "Required" });
  if (!body.paymentMethod)      errs.push({ field: "paymentMethod",      issue: "Required" });
  // Accounting accounts are required to post ledger entries
  if (!body.cashAccountCode)          errs.push({ field: "cashAccountCode",         issue: "Required — GL account code for cash/bank debit" });
  if (!body.loanAssetAccountCode)     errs.push({ field: "loanAssetAccountCode",    issue: "Required — GL account code for Loans to Customers" });
  if (!body.interestIncomeAccountCode) errs.push({ field: "interestIncomeAccountCode", issue: "Required — GL account code for Interest Income" });
  if (errs.length) return validationError(errs);

  const loanId          = parseInt(String(body.loanId));
  const loanInstalmentId = parseInt(String(body.loanInstalmentId));
  const paymentAmount   = Number(body.paymentAmount);
  const principalAmount = Number(body.principalAmount ?? 0);
  const interestAmount  = Number(body.interestAmount  ?? 0);
  const monitoringFee   = Number(body.monitoringFee   ?? 0);
  const penalties       = Number(body.penalties       ?? 0);

  // Validate sum of components = paymentAmount
  const componentSum = principalAmount + interestAmount + monitoringFee + penalties;
  if (Math.abs(componentSum - paymentAmount) > 1) {
    return unprocessable(
      "PAYMENT_MISMATCH",
      `Component sum (${componentSum}) does not equal paymentAmount (${paymentAmount}).`
    );
  }

  const instalment = await prisma.loanInstalment.findUnique({ where: { instalmentId: loanInstalmentId } });
  if (!instalment) return notFound("instalment");

  // Validate payment doesn't exceed balance remaining
  if (paymentAmount > Number(instalment.balanceRemaining) + Number(instalment.penaltyAmount) + 1) {
    return unprocessable("PAYMENT_EXCEEDS_OUTSTANDING", "Payment amount exceeds outstanding instalment balance.");
  }

  const loan = await prisma.loanPortfolio.findUnique({ where: { loanId } });
  if (!loan) return notFound("loan");

  const accounts: PaymentAccounts = {
    cashAccountCode:              String(body.cashAccountCode),
    loanAssetAccountCode:         String(body.loanAssetAccountCode),
    interestIncomeAccountCode:    String(body.interestIncomeAccountCode),
    mgmtFeeAccountCode:           body.mgmtFeeAccountCode    ? String(body.mgmtFeeAccountCode)    : undefined,
    penaltyAccountCode:           body.penaltyAccountCode    ? String(body.penaltyAccountCode)    : undefined,
  };

  const daysOverdue = calculateDaysOverdue(instalment.dueDate.toISOString().split("T")[0]);

  // Create payment record within a transaction
  const payment = await prisma.$transaction(async (tx) => {
    const p = await (tx as typeof prisma).loanPayment.create({
      data: {
        loanInstalmentId,
        loanId,
        paymentDate:     new Date(String(body.paymentDate)),
        beginningBalance: instalment.balanceRemaining,
        paymentAmount,
        principalAmount,
        interestAmount,
        monitoringFee,
        penalties,
        paymentMethod:   body.paymentMethod as "Cash" | "Bank" | "Mobile_Money",
        referenceNumber: body.referenceNumber ? String(body.referenceNumber) : undefined,
        isPrepayment:    Boolean(body.isPrepayment),
        prepaymentScope: body.prepaymentScope ? String(body.prepaymentScope) : undefined,
        daysOverdue,
        recordedBy:      parseInt(req.user.sub),
      } as any,
    });

    // Update instalment paid amounts
    const newPaidAmount    = Number(instalment.paidAmount)    + paymentAmount;
    const newPrincipalPaid = Number(instalment.principalPaid) + principalAmount;
    const newInterestPaid  = Number(instalment.interestPaid)  + interestAmount;
    const newMgmtFeePaid   = Number(instalment.managementFeePaid) + monitoringFee;
    const newPenaltyPaid   = Number(instalment.penaltyPaid)   + penalties;
    const newBalance       = Math.max(0, Number(instalment.balanceRemaining) - paymentAmount);

    const isFullyPaid = newBalance <= 0;
    const isPartial   = !isFullyPaid && newPaidAmount > 0;

    await (tx as typeof prisma).loanInstalment.update({
      where: { instalmentId: loanInstalmentId },
      data: {
        paidAmount:       newPaidAmount,
        principalPaid:    newPrincipalPaid,
        interestPaid:     newInterestPaid,
        managementFeePaid: newMgmtFeePaid,
        penaltyPaid:      newPenaltyPaid,
        balanceRemaining: newBalance,
        status:           isFullyPaid ? "Fully_Paid" : isPartial ? "Partially_Paid" : instalment.status,
        paymentDate:      isFullyPaid ? new Date(String(body.paymentDate)) : instalment.paymentDate,
      },
    });

    return p;
  });

  // Post ledger entries
  await createPaymentEntries(
    prisma,
    {
      paymentId:      payment.paymentId,
      loanId,
      paymentDate:    payment.paymentDate,
      paymentAmount,
      principalAmount,
      interestAmount,
      monitoringFee,
      penalties,
      createdBy:      parseInt(req.user.sub),
      createdAt:      payment.createdAt,
    },
    accounts
  );

  // Sync loan portfolio totals
  await syncLoanPortfolio(prisma, loanId);

  const updatedLoan       = await prisma.loanPortfolio.findUnique({ where: { loanId } });
  const updatedInstalment = await prisma.loanInstalment.findUnique({ where: { instalmentId: loanInstalmentId } });

  return createdResponse({
    payment:           formatPayment(payment as unknown as Record<string, unknown>),
    updatedLoan,
    updatedInstalment,
  });
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;
