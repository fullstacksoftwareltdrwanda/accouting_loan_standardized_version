import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, validationError, errorResponse } from "@/lib/api-response";
import { syncLoanPortfolio } from "@/helpers/accounting-functions";
import { formatLoan } from "@/app/api/loans/route";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/loans/[id]/write-off
export const PATCH = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const loanId = parseInt(ctx.params.id);
  const loan = await prisma.loanPortfolio.findUnique({ where: { loanId } });
  if (!loan) return notFound("loan");

  if (loan.loanStatus === "Settled") return errorResponse("LOAN_ALREADY_SETTLED", "Loan is already settled.", undefined, 409);

  let body: { reason?: string; writeOffDate?: string };
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];
  if (!body.reason)      errs.push({ field: "reason",      issue: "Required" });
  if (!body.writeOffDate) errs.push({ field: "writeOffDate", issue: "Required" });
  if (errs.length) return validationError(errs);

  const updated = await prisma.loanPortfolio.update({
    where: { loanId },
    data: {
      loanStatus:     "Written_Off",
      writeOffReason: body.reason,
      writeOffDate:   new Date(body.writeOffDate!),
    },
    include: { customer: { select: { customerName: true, customerCode: true } } },
  });

  await syncLoanPortfolio(prisma, loanId);

  // Post write-off ledger entries (DR Bad Debt Expense, CR Loans to Customers)
  // Account codes come from the chart of accounts — caller is responsible for providing them
  // if they want accounting entries; otherwise the status update alone is sufficient here.

  return successResponse({
    loan: formatLoan(updated as unknown as Record<string, unknown>),
    journalEntryId: null, // populated when accounting module POSTs entries
  });
}, ["Director", "MD", "Developer"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
