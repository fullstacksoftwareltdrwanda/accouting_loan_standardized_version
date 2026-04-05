import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";

// GET /api/reports/dashboard
export const GET = withAuth(async (_req: AuthedRequest) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    portfolioAgg,
    overdueCount,
    activeCount,
    settledCount,
    pendingCount,
    todayPayments,
    recentLoans,
    recentPayments,
    overdueLoans,
  ] = await Promise.all([
    prisma.loanPortfolio.aggregate({
      _sum:   { loanAmount: true, totalOutstanding: true, totalPaid: true, totalDisbursed: true },
      _count: { loanId: true },
      where:  { loanStatus: { notIn: ["Draft", "Rejected"] } },
    }),
    prisma.loanPortfolio.count({ where: { loanStatus: "Overdue" } }),
    prisma.loanPortfolio.count({ where: { loanStatus: "Active"  } }),
    prisma.loanPortfolio.count({ where: { loanStatus: "Settled" } }),
    prisma.pendingApproval.count({ where: { status: "pending" } }),
    prisma.loanPayment.aggregate({
      _sum:   { paymentAmount: true },
      _count: { paymentId: true },
      where:  { paymentDate: { gte: today }, reversedAt: null },
    }),
    prisma.loanPortfolio.findMany({
      take:    5,
      orderBy: { createdAt: "desc" },
      where:   { loanStatus: { notIn: ["Draft"] } },
      include: { customer: { select: { customerName: true } } },
    }),
    prisma.loanPayment.findMany({
      take:    5,
      orderBy: { paymentDate: "desc" },
      where:   { reversedAt: null },
      include: { loan: { select: { loanNumber: true } } },
    }),
    prisma.loanPortfolio.findMany({
      take:    5,
      orderBy: { daysOverdue: "desc" },
      where:   { loanStatus: "Overdue" },
      include: { customer: { select: { customerName: true } } },
    }),
  ]);

  const totalPortfolio   = Number(portfolioAgg._sum.loanAmount    ?? 0);
  const totalOutstanding = Number(portfolioAgg._sum.totalOutstanding ?? 0);
  const totalCollected   = Number(portfolioAgg._sum.totalPaid     ?? 0);
  const todayCollected   = Number(todayPayments._sum.paymentAmount ?? 0);

  return successResponse({
    metrics: {
      totalPortfolio,
      totalOutstanding,
      totalCollected,
      overdueCount,
      activeCount,
      settledCount,
      pendingApprovalCount: pendingCount,
      todayCollected,
      todayPaymentCount: todayPayments._count.paymentId,
    },
    recentLoans: recentLoans.map((l) => ({
      id:           String(l.loanId),
      loanNumber:   l.loanNumber,
      customerName: (l as Record<string, unknown> & { customer?: { customerName?: string } }).customer?.customerName ?? "",
      loanAmount:   Number(l.loanAmount),
      loanStatus:   l.loanStatus,
      createdAt:    l.createdAt.toISOString(),
    })),
    recentPayments: recentPayments.map((p) => ({
      id:            String(p.paymentId),
      loanNumber:    (p as Record<string, unknown> & { loan?: { loanNumber?: string } }).loan?.loanNumber ?? "",
      paymentAmount: Number(p.paymentAmount),
      paymentDate:   p.paymentDate.toISOString().split("T")[0],
      paymentMethod: p.paymentMethod,
    })),
    overdueLoans: overdueLoans.map((l) => ({
      id:           String(l.loanId),
      loanNumber:   l.loanNumber,
      customerName: (l as Record<string, unknown> & { customer?: { customerName?: string } }).customer?.customerName ?? "",
      daysOverdue:  l.daysOverdue,
      outstanding:  Number(l.totalOutstanding),
    })),
  });
}) as unknown as (req: NextRequest) => Promise<Response>;
