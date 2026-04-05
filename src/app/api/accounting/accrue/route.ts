import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, errorResponse } from "@/lib/api-response";
import { createJournalEntry } from "@/helpers/accounting-functions";

// POST /api/accounting/accrue — period-end interest accrual
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: {
    accrualDate?: string;
    interestIncomeAccountCode?: string;
    interestReceivableAccountCode?: string;
  } = {};
  try { body = await req.json(); } catch { /**/ }

  if (!body.accrualDate) return errorResponse("VALIDATION_FAILED", "accrualDate is required.", undefined, 400);
  if (!body.interestIncomeAccountCode) return errorResponse("VALIDATION_FAILED", "interestIncomeAccountCode is required — GL code for Interest Income", undefined, 400);
  if (!body.interestReceivableAccountCode) return errorResponse("VALIDATION_FAILED", "interestReceivableAccountCode is required — GL code for Interest Receivable", undefined, 400);

  const accrualDate = new Date(body.accrualDate);

  // Find all active loans with unpaid interest this month
  const activeLoans = await prisma.loanPortfolio.findMany({
    where: { loanStatus: { in: ["Active", "Overdue"] } },
    include: {
      instalments: {
        where: {
          dueDate: { lte: accrualDate },
          status:  { in: ["Pending", "Partially_Paid", "Overdue"] },
        },
      },
    },
  });

  let journalsPosted = 0;
  let totalAccrued   = 0;

  for (const loan of activeLoans) {
    const unaccruedInterest = loan.instalments.reduce((sum, inst) => {
      const unpaidInterest = Number(inst.interestAmount) - Number(inst.interestPaid);
      return sum + Math.max(0, unpaidInterest);
    }, 0);

    if (unaccruedInterest <= 0) continue;

    try {
      await createJournalEntry(
        prisma,
        accrualDate,
        `Interest Accrual — Loan ${loan.loanNumber}`,
        [
          {
            accountCode:   body.interestReceivableAccountCode!,
            particular:    `Accrued Interest — Loan ${loan.loanNumber}`,
            debitAmount:   unaccruedInterest,
            creditAmount:  0,
            referenceType: "accrual",
            referenceId:   String(loan.loanId),
            createdBy:     parseInt(req.user.sub),
          },
          {
            accountCode:   body.interestIncomeAccountCode!,
            particular:    `Interest Income Accrual — Loan ${loan.loanNumber}`,
            debitAmount:   0,
            creditAmount:  unaccruedInterest,
            referenceType: "accrual",
            referenceId:   String(loan.loanId),
            createdBy:     parseInt(req.user.sub),
          },
        ],
        `ACCR-${loan.loanId}`,
        parseInt(req.user.sub)
      );

      await prisma.loanPortfolio.update({
        where: { loanId: loan.loanId },
        data:  { accruedInterest: unaccruedInterest },
      });

      journalsPosted++;
      totalAccrued += unaccruedInterest;
    } catch { /* skip loans where account codes don't resolve */ }
  }

  return successResponse({ loansProcessed: activeLoans.length, journalsPosted, totalAccrued });
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;
