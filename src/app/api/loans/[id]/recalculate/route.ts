import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound } from "@/lib/api-response";
import { generateLoanSchedule } from "@/helpers/loan-calculations";
import { syncLoanPortfolio } from "@/helpers/accounting-functions";
import { formatLoan } from "@/app/api/loans/route";
import { formatInstalment } from "@/app/api/loans/[id]/route";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/loans/[id]/recalculate — rebuild schedule from current state
export const POST = withAuth(async (_req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const loanId = parseInt(ctx.params.id);
  const loan = await prisma.loanPortfolio.findUnique({
    where:   { loanId },
    include: { customer: { select: { customerName: true, customerCode: true } } },
  });
  if (!loan) return notFound("loan");

  // Only rebuild future (unpaid) instalments; keep paid ones intact
  const unpaidInstalments = await prisma.loanInstalment.findMany({
    where:   { loanId, status: { in: ["Pending", "Overdue"] } },
    orderBy: { instalmentNumber: "asc" },
  });

  // Delete unpaid instalments and regenerate
  await prisma.loanInstalment.deleteMany({
    where: { loanId, status: { in: ["Pending", "Overdue"] } },
  });

  // Get the current remaining principal
  const currentOutstanding = Number(loan.principalOutstanding);
  if (currentOutstanding > 0 && unpaidInstalments.length > 0) {
    const firstUnpaid = unpaidInstalments[0];
    const remainingPeriods = unpaidInstalments.length;

    const schedule = generateLoanSchedule({
      loanAmount:           currentOutstanding,
      interestRate:         Number(loan.interestRate),
      numberOfInstalments:  remainingPeriods,
      managementFeeRate:    Number(loan.managementFeeRate),
      deductFeeUpfront:     false, // fee not deducted again for recalculation
      firstPaymentDate:     firstUnpaid.dueDate.toISOString().split("T")[0],
    });

    for (const row of schedule.instalments) {
      await prisma.loanInstalment.create({
        data: {
          loanId,
          loanNumber:       loan.loanNumber,
          instalmentNumber: firstUnpaid.instalmentNumber + row.instalmentNumber - 1,
          dueDate:          new Date(row.dueDate),
          openingBalance:   row.openingBalance,
          closingBalance:   row.closingBalance,
          principalAmount:  row.principalAmount,
          interestAmount:   row.interestAmount,
          managementFee:    row.managementFee,
          totalPayment:     row.totalPayment,
          balanceRemaining: row.totalPayment,
          status:           "Pending",
          createdBy:        loan.createdBy,
        },
      });
    }
  }

  await syncLoanPortfolio(prisma, loanId);

  const refreshedLoan = await prisma.loanPortfolio.findUnique({
    where:   { loanId },
    include: {
      customer:    { select: { customerName: true, customerCode: true } },
      instalments: { orderBy: { instalmentNumber: "asc" } },
    },
  });

  return successResponse({
    loan:       formatLoan(refreshedLoan as unknown as Record<string, unknown>),
    instalments: (refreshedLoan?.instalments ?? []).map(formatInstalment),
  });
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
