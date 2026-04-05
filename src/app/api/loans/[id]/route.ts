import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, createdResponse, notFound, validationError, errorResponse } from "@/lib/api-response";
import { formatLoan } from "@/app/api/loans/route";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/loans/[id] — full detail with instalments and payments
export const GET = withAuth(async (_req: AuthedRequest, ctx: any) => {
  const params = await ctx.params;
  const loanId = parseInt(params.id);
  const loan = await prisma.loanPortfolio.findUnique({
    where: { loanId },
    include: {
      customer:    { select: { customerName: true, customerCode: true } },
      instalments: { orderBy: { instalmentNumber: "asc" } },
      payments:    { orderBy: { paymentDate: "desc" } },
    },
  });

  if (!loan) return notFound("loan");

  return successResponse({
    loan: {
      ...formatLoan(loan as unknown as Record<string, unknown>),
      instalments: loan.instalments.map(formatInstalment),
      payments:    loan.payments.map(formatPayment),
    },
  });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;

// PUT /api/loans/[id] — modify loan (creates approval)
export const PUT = withAuth(async (req: AuthedRequest, ctx: any) => {
  const params = await ctx.params;
  const loanId = parseInt(params.id);
  const loan = await prisma.loanPortfolio.findUnique({ where: { loanId } });
  if (!loan) return notFound("loan");

  if (loan.loanStatus === "Settled")    return errorResponse("LOAN_ALREADY_SETTLED", "Cannot modify a settled loan.", undefined, 409);
  if (loan.loanStatus === "Written_Off") return errorResponse("LOAN_ALREADY_SETTLED", "Cannot modify a written-off loan.", undefined, 409);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }
  if (!body.reason) return validationError([{ field: "reason", issue: "Mandatory change justification required" }]);

  const approval = await prisma.pendingApproval.create({
    data: {
      actionType:     "EDIT_LOAN",
      entityType:     "loan",
      entityId:       loanId,
      actionData:     JSON.stringify(body),
      previousState:  JSON.stringify(loan),
      description:    `Edit loan ${loan.loanNumber}: ${body.reason}`,
      submittedBy:    req.user.sub,
      submittedByRole: req.user.role,
    },
  });

  return createdResponse({ approvalId: String(approval.approvalId) });
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;

// DELETE /api/loans/[id] — reject/cancel a pending loan
export const DELETE = withAuth(async (req: AuthedRequest, ctx: any) => {
  const params = await ctx.params;
  const loanId = parseInt(params.id);
  const loan = await prisma.loanPortfolio.findUnique({ where: { loanId } });
  if (!loan) return notFound("loan");

  if (!["Pending_Approval", "Draft"].includes(loan.loanStatus)) {
    return errorResponse("LOAN_ALREADY_ACTIVE", "Cannot delete an active, settled or overdue loan.", undefined, 409);
  }

  let body: { reason?: string } = {};
  try { body = await req.json(); } catch { /**/ }
  if (!body.reason) return validationError([{ field: "reason", issue: "Rejection reason is required" }]);

  await prisma.loanPortfolio.update({
    where: { loanId },
    data:  { loanStatus: "Rejected" },
  });

  return successResponse({ success: true });
}, ["Director", "MD", "Developer"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatInstalment(i: Record<string, unknown>) {
  return {
    id:               String(i.instalmentId),
    loanId:           String(i.loanId),
    instalmentNumber: i.instalmentNumber,
    dueDate:          i.dueDate instanceof Date ? i.dueDate.toISOString().split("T")[0] : i.dueDate,
    openingBalance:   Number(i.openingBalance),
    closingBalance:   Number(i.closingBalance),
    principalAmount:  Number(i.principalAmount),
    interestAmount:   Number(i.interestAmount),
    managementFee:    Number(i.managementFee),
    totalPayment:     Number(i.totalPayment),
    paidAmount:       Number(i.paidAmount),
    principalPaid:    Number(i.principalPaid),
    interestPaid:     Number(i.interestPaid),
    managementFeePaid: Number(i.managementFeePaid),
    balanceRemaining: Number(i.balanceRemaining),
    status:           i.status,
    daysOverdue:      i.daysOverdue,
    penaltyAmount:    Number(i.penaltyAmount),
    penaltyPaid:      Number(i.penaltyPaid),
    paymentDate:      i.paymentDate instanceof Date ? i.paymentDate.toISOString().split("T")[0] : (i.paymentDate ?? null),
  };
}

export function formatPayment(p: Record<string, unknown>) {
  return {
    id:              String(p.paymentId),
    loanId:          String(p.loanId),
    loanInstalmentId: String(p.loanInstalmentId),
    customerId:      p.customerId ? String(p.customerId) : null,
    paymentDate:     p.paymentDate instanceof Date ? p.paymentDate.toISOString().split("T")[0] : p.paymentDate,
    paymentAmount:   Number(p.paymentAmount),
    principalAmount: Number(p.principalAmount),
    interestAmount:  Number(p.interestAmount),
    monitoringFee:   Number(p.monitoringFee),
    penalties:       Number(p.penalties),
    paymentMethod:   p.paymentMethod,
    referenceNumber: p.referenceNumber,
    isPrepayment:    p.isPrepayment,
    prepaymentScope: p.prepaymentScope,
    reversedAt:      p.reversedAt instanceof Date ? p.reversedAt.toISOString() : (p.reversedAt ?? null),
    reversalReason:  p.reversalReason ?? null,
    recordedBy:      p.recordedBy,
    createdAt:       p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
  };
}
