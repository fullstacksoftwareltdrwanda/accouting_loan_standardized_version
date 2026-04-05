import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound } from "@/lib/api-response";
import { generateLoanSchedule } from "@/helpers/loan-calculations";
import { syncLoanPortfolio } from "@/helpers/accounting-functions";
import { formatLoan } from "@/app/api/loans/route";
import { formatInstalment } from "@/app/api/loans/[id]/route";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/loans/[id]/payments
export const GET = withAuth(async (_req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const loanId = parseInt(ctx.params.id);
  const loan = await prisma.loanPortfolio.findUnique({ where: { loanId } });
  if (!loan) return notFound("loan");

  const payments = await prisma.loanPayment.findMany({
    where:   { loanId },
    orderBy: { paymentDate: "desc" },
  });

  return successResponse({
    payments: payments.map((p) => ({
      id:              String(p.paymentId),
      loanId:          String(p.loanId),
      paymentDate:     p.paymentDate.toISOString().split("T")[0],
      paymentAmount:   Number(p.paymentAmount),
      principalAmount: Number(p.principalAmount),
      interestAmount:  Number(p.interestAmount),
      monitoringFee:   Number(p.monitoringFee),
      penalties:       Number(p.penalties),
      paymentMethod:   p.paymentMethod,
      referenceNumber: p.referenceNumber,
      isPrepayment:    (p as any).isPrepayment,
      reversedAt:      (p as any).reversedAt?.toISOString() ?? null,
      createdAt:       p.createdAt.toISOString(),
    })),
  });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
