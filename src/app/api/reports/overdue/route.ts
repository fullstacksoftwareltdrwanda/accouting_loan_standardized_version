import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";

// GET /api/reports/overdue
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const minDays = searchParams.get("minDays") ? parseInt(searchParams.get("minDays")!) : 1;

  const overdueLoans = await prisma.loanPortfolio.findMany({
    where: { loanStatus: "Overdue", daysOverdue: { gte: minDays } },
    orderBy: { daysOverdue: "desc" },
    include: {
      customer: { select: { customerName: true, phone: true } },
      instalments: {
        where:   { status: "Overdue" },
        orderBy: { dueDate: "asc" },
      },
    },
  });

  return successResponse({
    overdueLoans: overdueLoans.map((l) => {
      const c = (l as Record<string, unknown> & { customer?: { customerName?: string; phone?: string } }).customer;
      const overdueInstalments = l.instalments ?? [];
      return {
        loanId:          String(l.loanId),
        loanNumber:      l.loanNumber,
        customerName:    c?.customerName ?? "",
        customerPhone:   c?.phone ?? "",
        daysOverdue:     l.daysOverdue,
        totalOutstanding: Number(l.totalOutstanding),
        penalties:       Number(l.penalties),
        overdueInstalments: overdueInstalments.map((i) => ({
          instalmentNumber: i.instalmentNumber,
          dueDate:          i.dueDate.toISOString().split("T")[0],
          amountDue:        Number(i.totalPayment),
          amountPaid:       Number(i.paidAmount),
          balance:          Number(i.balanceRemaining),
        })),
      };
    }),
  });
}) as unknown as (req: NextRequest) => Promise<Response>;
