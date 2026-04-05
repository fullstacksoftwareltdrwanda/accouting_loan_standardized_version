import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/customers/[id]/statements
export const GET = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const customerId = parseInt(ctx.params.id);
  const customer = await prisma.customer.findUnique({ where: { customerId } });
  if (!customer) return notFound("customer");

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
  const to   = searchParams.get("to")   ? new Date(searchParams.get("to")!)   : new Date();

  const payments = await prisma.loanPayment.findMany({
    where: {
      customerId,
      ...(from ? { paymentDate: { gte: from, lte: to } } : {}),
    },
    orderBy: { paymentDate: "asc" },
    include: { loan: { select: { loanNumber: true } } },
  });

  const totalBorrowed  = Number(customer.totalDisbursed);
  const totalRepaid    = Number(customer.totalPaid);
  const outstanding    = Number(customer.totalOutstanding);

  return successResponse({
    customer: {
      id:   String(customer.customerId),
      name: customer.customerName,
      code: customer.customerCode,
    },
    period: {
      from: from?.toISOString().split("T")[0] ?? null,
      to:   to.toISOString().split("T")[0],
    },
    transactions: payments.map((p) => ({
      date:       p.paymentDate.toISOString().split("T")[0],
      type:       "payment",
      loanNumber: p.loan.loanNumber,
      amount:     Number(p.paymentAmount),
      method:     p.paymentMethod,
      reference:  p.referenceNumber,
    })),
    summary: { totalBorrowed, totalRepaid, outstanding },
  });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
