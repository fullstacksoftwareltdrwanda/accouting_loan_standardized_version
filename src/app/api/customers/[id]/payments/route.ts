import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/customers/[id]/payments
export const GET = withAuth(async (_req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const customerId = parseInt(ctx.params.id);
  const customer = await prisma.customer.findUnique({ where: { customerId } });
  if (!customer) return notFound("customer");

  const payments = await prisma.loanPayment.findMany({
    where: { customerId },
    orderBy: { paymentDate: "desc" },
    include: { loan: { select: { loanNumber: true } } },
  });

  return successResponse({
    payments: payments.map((p) => ({
      id:              String(p.paymentId),
      loanId:          String(p.loanId),
      loanNumber:      p.loan.loanNumber,
      customerId:      String(customerId),
      paymentDate:     p.paymentDate.toISOString().split("T")[0],
      paymentAmount:   Number(p.paymentAmount),
      principalAmount: Number(p.principalAmount),
      interestAmount:  Number(p.interestAmount),
      monitoringFee:   Number(p.monitoringFee),
      penalties:       Number(p.penalties),
      paymentMethod:   p.paymentMethod,
      referenceNumber: p.referenceNumber,
      isPrepayment:    p.isPrepayment,
      reversedAt:      p.reversedAt?.toISOString() ?? null,
      createdAt:       p.createdAt.toISOString(),
    })),
  });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
