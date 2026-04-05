import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, validationError, errorResponse } from "@/lib/api-response";
import { reversePaymentEntries, syncLoanPortfolio } from "@/helpers/accounting-functions";
import { formatPayment } from "@/app/api/loans/[id]/route";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/payments/[id]
export const GET = withAuth(async (_req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const paymentId = parseInt(ctx.params.id);
  const payment = await prisma.loanPayment.findUnique({ where: { paymentId } });
  if (!payment) return notFound("payment");
  return successResponse({ payment: formatPayment(payment as unknown as Record<string, unknown>) });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;

// DELETE /api/payments/[id] — reverse a payment
export const DELETE = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const paymentId = parseInt(ctx.params.id);
  const payment = await prisma.loanPayment.findUnique({
    where: { paymentId },
    include: { instalment: true },
  });
  if (!payment) return notFound("payment");
  if (payment.reversedAt) return errorResponse("PAYMENT_ALREADY_REVERSED", "Payment has already been reversed.", undefined, 409);

  let body: { reason?: string } = {};
  try { body = await req.json(); } catch { /**/ }
  if (!body.reason) return validationError([{ field: "reason", issue: "Reversal reason is required" }]);

  // Large reversals require Director/MD approval
  const THRESHOLD = 5000000; // ₦50,000 = 5,000,000 kobo
  if (Number(payment.paymentAmount) > THRESHOLD && !["Director", "MD", "Developer"].includes(req.user.role)) {
    const approval = await prisma.pendingApproval.create({
      data: {
        actionType:     "REVERSE_PAYMENT",
        entityType:     "payment",
        entityId:       paymentId,
        actionData:     JSON.stringify({ paymentId, reason: body.reason }),
        description:    `Payment reversal request for ₦${Number(payment.paymentAmount) / 100}`,
        submittedBy:    req.user.sub,
        submittedByRole: req.user.role,
      },
    });
    return successResponse({ requiresApproval: true, approvalId: String(approval.approvalId) });
  }

  // Restore instalment amounts
  await prisma.$transaction(async (tx) => {
    const inst = payment.instalment;
    await (tx as typeof prisma).loanInstalment.update({
      where: { instalmentId: inst.instalmentId },
      data: {
        paidAmount:       Math.max(0, Number(inst.paidAmount)    - Number(payment.paymentAmount)),
        principalPaid:    Math.max(0, Number(inst.principalPaid) - Number(payment.principalAmount)),
        interestPaid:     Math.max(0, Number(inst.interestPaid)  - Number(payment.interestAmount)),
        managementFeePaid: Math.max(0, Number(inst.managementFeePaid) - Number(payment.monitoringFee)),
        penaltyPaid:      Math.max(0, Number(inst.penaltyPaid)   - Number(payment.penalties)),
        balanceRemaining: Number(inst.balanceRemaining) + Number(payment.paymentAmount),
        status:           "Pending",
        paymentDate:      null,
      },
    });

    await (tx as typeof prisma).loanPayment.update({
      where: { paymentId },
      data: { reversedAt: new Date(), reversalReason: body.reason },
    });
  });

  // Reverse ledger entries and sync portfolio
  await reversePaymentEntries(prisma, paymentId);
  await syncLoanPortfolio(prisma, payment.loanId);

  const updatedLoan       = await prisma.loanPortfolio.findUnique({ where: { loanId: payment.loanId } });
  const updatedInstalment = await prisma.loanInstalment.findUnique({ where: { instalmentId: payment.loanInstalmentId } });

  return successResponse({ success: true, updatedLoan, updatedInstalment });
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
