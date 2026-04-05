import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";

// GET /api/reports/income-analysis
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date(new Date().getFullYear(), 0, 1);
  const to   = searchParams.get("to")   ? new Date(searchParams.get("to")!)   : new Date();

  const loans = await prisma.loanPortfolio.findMany({
    where:   { loanStatus: { in: ["Active", "Overdue", "Settled"] } },
    include: { customer: { select: { customerName: true } } },
  });

  const items = await Promise.all(
    loans.map(async (loan) => {
      const periodPayments = await prisma.loanPayment.findMany({
        where: { loanId: loan.loanId, paymentDate: { gte: from, lte: to }, reversedAt: null },
      });

      const allPayments = await prisma.loanPayment.findMany({
        where: { loanId: loan.loanId, reversedAt: null },
      });

      const periodInterest   = periodPayments.reduce((s, p) => s + Number(p.interestAmount), 0);
      const periodMgmt       = periodPayments.reduce((s, p) => s + Number(p.monitoringFee),  0);
      const periodPenalties  = periodPayments.reduce((s, p) => s + Number(p.penalties),      0);

      const allTimeInterest  = allPayments.reduce((s, p) => s + Number(p.interestAmount), 0);
      const allTimeMgmt      = allPayments.reduce((s, p) => s + Number(p.monitoringFee),  0);

      const remainingInterest = Number(loan.interestOutstanding);
      const remainingMgmt     = Number(loan.totalManagementFees) - Number(loan.totalManagementFeesPaid);
      const c = (loan as Record<string, unknown> & { customer?: { customerName?: string } }).customer;

      return {
        loanNumber:   loan.loanNumber,
        customerName: c?.customerName ?? "",
        period: {
          interest:     periodInterest,
          monitoringFee: periodMgmt,
          penalties:    periodPenalties,
        },
        allTime: {
          interest:     allTimeInterest,
          monitoringFee: allTimeMgmt,
        },
        remaining: {
          interest:     remainingInterest,
          monitoringFee: remainingMgmt,
        },
      };
    })
  );

  return successResponse({
    period: { from: from.toISOString().split("T")[0], to: to.toISOString().split("T")[0] },
    items,
    totals: {
      periodInterest:    items.reduce((s, i) => s + i.period.interest,      0),
      periodMgmt:        items.reduce((s, i) => s + i.period.monitoringFee, 0),
      periodPenalties:   items.reduce((s, i) => s + i.period.penalties,     0),
      allTimeInterest:   items.reduce((s, i) => s + i.allTime.interest,     0),
      allTimeMgmt:       items.reduce((s, i) => s + i.allTime.monitoringFee,0),
      remainingInterest: items.reduce((s, i) => s + i.remaining.interest,   0),
      remainingMgmt:     items.reduce((s, i) => s + i.remaining.monitoringFee, 0),
    },
  });
}) as unknown as (req: NextRequest) => Promise<Response>;
