import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/customers/[id]/loans
export const GET = withAuth(async (_req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const customerId = parseInt(ctx.params.id);
  const customer = await prisma.customer.findUnique({ where: { customerId } });
  if (!customer) return notFound("customer");

  const loans = await prisma.loanPortfolio.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });

  return successResponse({
    loans: loans.map((l) => ({
      id:                 String(l.loanId),
      loanNumber:         l.loanNumber,
      customerId:         String(l.customerId),
      loanAmount:         Number(l.loanAmount),
      interestRate:       Number(l.interestRate),
      numberOfInstalments: l.numberOfInstalments,
      managementFeeRate:  Number(l.managementFeeRate),
      deductFeeUpfront:   l.deductFeeUpfront,
      totalDisbursed:     Number(l.totalDisbursed),
      monthlyPayment:     Number(l.monthlyPayment),
      totalInterest:      Number(l.totalInterest),
      totalPayment:       Number(l.totalPayment),
      disbursementDate:   l.disbursementDate.toISOString().split("T")[0],
      firstPaymentDate:   l.firstPaymentDate.toISOString().split("T")[0],
      maturityDate:       l.maturityDate.toISOString().split("T")[0],
      loanStatus:         l.loanStatus,
      principalOutstanding: Number(l.principalOutstanding),
      totalOutstanding:   Number(l.totalOutstanding),
      totalPaid:          Number(l.totalPaid),
      daysOverdue:        l.daysOverdue,
      createdAt:          l.createdAt.toISOString(),
    })),
  });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
