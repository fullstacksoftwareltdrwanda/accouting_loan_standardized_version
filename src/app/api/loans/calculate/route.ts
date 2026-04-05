import { NextRequest } from "next/server";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, validationError } from "@/lib/api-response";
import { generateLoanSchedule } from "@/helpers/loan-calculations";

// POST /api/loans/calculate — preview schedule without persisting
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];
  if (!body.loanAmount)          errs.push({ field: "loanAmount",          issue: "Required" });
  if (!body.interestRate)        errs.push({ field: "interestRate",        issue: "Required" });
  if (!body.numberOfInstalments) errs.push({ field: "numberOfInstalments", issue: "Required" });
  if (body.deductFeeUpfront === undefined) errs.push({ field: "deductFeeUpfront", issue: "Required" });
  if (!body.firstPaymentDate)    errs.push({ field: "firstPaymentDate",    issue: "Required" });
  if (errs.length) return validationError(errs);

  const schedule = generateLoanSchedule({
    loanAmount:           Number(body.loanAmount),
    interestRate:         Number(body.interestRate),
    numberOfInstalments:  parseInt(String(body.numberOfInstalments)),
    managementFeeRate:    body.managementFeeRate ? Number(body.managementFeeRate) : 5.5,
    deductFeeUpfront:     Boolean(body.deductFeeUpfront),
    firstPaymentDate:     String(body.firstPaymentDate),
  });

  return successResponse({
    monthlyPayment:      schedule.summary.monthlyPayment,
    totalInterest:       schedule.summary.totalInterest,
    totalManagementFees: schedule.summary.totalManagementFees,
    totalPayment:        schedule.summary.totalPayment,
    totalDisbursed:      schedule.summary.totalDisbursed,
    managementFeeAmount: schedule.summary.managementFeeAmount,
    schedule:            schedule.instalments,
  });
}) as unknown as (req: NextRequest) => Promise<Response>;
