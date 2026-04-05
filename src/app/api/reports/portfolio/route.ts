import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";

// GET /api/reports/portfolio
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const asOf = searchParams.get("asOf") ? new Date(searchParams.get("asOf")!) : new Date();

  const [agg, byStatus, byDaysOverdue] = await Promise.all([
    prisma.loanPortfolio.aggregate({
      _sum:   { loanAmount: true, totalOutstanding: true, totalPaid: true, penalties: true },
      _count: { loanId: true },
      where:  { loanStatus: { notIn: ["Draft", "Rejected"] } },
    }),
    prisma.loanPortfolio.groupBy({
      by:      ["loanStatus"],
      _count:  { loanId: true },
      _sum:    { loanAmount: true, totalOutstanding: true },
    }),
    prisma.loanPortfolio.groupBy({
      by:      ["loanStatus"],
      _count:  { loanId: true },
      _sum:    { totalOutstanding: true },
      where:   { loanStatus: "Overdue" },
      orderBy: { _count: { loanId: "desc" } },
    }),
  ]);

  const overduePortfolio = await prisma.loanPortfolio.findMany({
    where:   { loanStatus: "Overdue" },
    orderBy: { daysOverdue: "desc" },
    include: { customer: { select: { customerName: true } } },
    take:    20,
  });

  return successResponse({
    asOf:               asOf.toISOString().split("T")[0],
    totalLoans:         agg._count.loanId,
    totalPortfolioValue: Number(agg._sum.loanAmount    ?? 0),
    totalOutstanding:   Number(agg._sum.totalOutstanding ?? 0),
    totalCollected:     Number(agg._sum.totalPaid       ?? 0),
    totalPenalties:     Number(agg._sum.penalties       ?? 0),
    byStatus: byStatus.map((s) => ({
      status:      s.loanStatus,
      count:       s._count.loanId,
      loanAmount:  Number(s._sum.loanAmount ?? 0),
      outstanding: Number(s._sum.totalOutstanding ?? 0),
    })),
    overduePortfolio: overduePortfolio.map((l) => ({
      loanNumber:   l.loanNumber,
      customerName: (l as Record<string, unknown> & { customer?: { customerName?: string } }).customer?.customerName ?? "",
      daysOverdue:  l.daysOverdue,
      outstanding:  Number(l.totalOutstanding),
      penalties:    Number(l.penalties),
    })),
  });
}) as unknown as (req: NextRequest) => Promise<Response>;
