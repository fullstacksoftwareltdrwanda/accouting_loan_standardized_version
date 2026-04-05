import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";
import { calculateDaysOverdue } from "@/helpers/loan-calculations";

// POST /api/system/update-overdue — batch job to flag overdue loans
export const POST = withAuth(async (_req: AuthedRequest) => {
  const activeLoans = await prisma.loanPortfolio.findMany({
    where:   { loanStatus: { in: ["Active", "Overdue"] } },
    include: { instalments: { where: { status: { in: ["Pending", "Partially_Paid", "Overdue"] } } } },
  });

  let updated = 0;

  for (const loan of activeLoans) {
    let maxOverdue = 0;
    const hasOverdue = loan.instalments.some((inst) => {
      const days = calculateDaysOverdue(inst.dueDate.toISOString().split("T")[0]);
      if (days > 0) {
        maxOverdue = Math.max(maxOverdue, days);
        return true;
      }
      return false;
    });

    // Update instalment overdue days
    for (const inst of loan.instalments) {
      const days = calculateDaysOverdue(inst.dueDate.toISOString().split("T")[0]);
      if (days !== inst.daysOverdue) {
        await prisma.loanInstalment.update({
          where: { instalmentId: inst.instalmentId },
          data: {
            daysOverdue: days,
            status: days > 0 && inst.status !== "Fully_Paid" ? "Overdue" : inst.status,
          },
        });
      }
    }

    const newStatus = hasOverdue ? "Overdue" : loan.loanStatus === "Overdue" ? "Active" : loan.loanStatus;
    if (newStatus !== loan.loanStatus || maxOverdue !== loan.daysOverdue) {
      await prisma.loanPortfolio.update({
        where: { loanId: loan.loanId },
        data:  { loanStatus: newStatus, daysOverdue: maxOverdue },
      });
      updated++;
    }
  }

  return successResponse({ processed: activeLoans.length, updated });
}, ["Director", "MD", "Developer"]) as unknown as (req: NextRequest) => Promise<Response>;
