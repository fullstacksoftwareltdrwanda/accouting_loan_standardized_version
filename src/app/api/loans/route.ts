import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, createdResponse, validationError, notFound, buildPaginationMeta } from "@/lib/api-response";
import { generateLoanSchedule, computeMaturityDate } from "@/helpers/loan-calculations";

// GET /api/loans — paginated list with aggregates
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const status     = searchParams.get("status") ?? undefined;
  const customerId = searchParams.get("customerId") ? parseInt(searchParams.get("customerId")!) : undefined;
  const search     = searchParams.get("search") ?? undefined;
  const overdue    = searchParams.get("overdue") === "true";
  const minAmount  = searchParams.get("minAmount") ? Number(searchParams.get("minAmount")) : undefined;
  const maxAmount  = searchParams.get("maxAmount") ? Number(searchParams.get("maxAmount")) : undefined;
  const page       = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage    = Math.min(100, parseInt(searchParams.get("perPage") ?? "25"));
  const sortBy     = searchParams.get("sortBy") ?? "createdAt";
  const sortDir    = (searchParams.get("sortDir") ?? "desc") as "asc" | "desc";

  const where: Record<string, unknown> = {};
  if (status)     where.loanStatus = status;
  if (customerId) where.customerId = customerId;
  if (overdue)    where.loanStatus = "Overdue";
  if (minAmount !== undefined) where.loanAmount = { gte: minAmount };
  if (maxAmount !== undefined) where.loanAmount = { ...(where.loanAmount as object || {}), lte: maxAmount };
  if (search) {
    where.OR = [
      { loanNumber: { contains: search, mode: "insensitive" } },
      { customer:   { customerName: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [total, loans, aggregates] = await Promise.all([
    prisma.loanPortfolio.count({ where }),
    prisma.loanPortfolio.findMany({
      where,
      skip:    (page - 1) * perPage,
      take:    perPage,
      orderBy: { [sortBy]: sortDir },
      include: { customer: { select: { customerName: true, customerCode: true } } },
    }),
    prisma.loanPortfolio.aggregate({
      _sum:   { loanAmount: true, totalOutstanding: true },
      _count: { loanId: true },
      where:  { loanStatus: { in: ["Active", "Overdue"] } },
    }),
  ]);

  const overdueCount = await prisma.loanPortfolio.count({ where: { loanStatus: "Overdue" } });
  const activeCount  = await prisma.loanPortfolio.count({ where: { loanStatus: "Active"  } });

  return successResponse(
    {
      loans: loans.map(formatLoan),
      aggregates: {
        totalPortfolioValue: Number(aggregates._sum.loanAmount ?? 0),
        totalOutstanding:    Number(aggregates._sum.totalOutstanding ?? 0),
        overdueCount,
        activeCount,
      },
    },
    buildPaginationMeta(total, page, perPage)
  );
}) as unknown as (req: NextRequest) => Promise<Response>;

// POST /api/loans — create loan application
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];
  if (!body.customerId)          errs.push({ field: "customerId",          issue: "Required" });
  if (!body.loanAmount)          errs.push({ field: "loanAmount",          issue: "Required" });
  if (!body.interestRate)        errs.push({ field: "interestRate",        issue: "Required" });
  if (!body.numberOfInstalments) errs.push({ field: "numberOfInstalments", issue: "Required" });
  if (!body.disbursementDate)    errs.push({ field: "disbursementDate",    issue: "Required" });
  if (!body.firstPaymentDate)    errs.push({ field: "firstPaymentDate",    issue: "Required" });
  if (!body.disbursementMethod)  errs.push({ field: "disbursementMethod",  issue: "Required" });
  if (body.deductFeeUpfront === undefined) errs.push({ field: "deductFeeUpfront", issue: "Required" });
  if (errs.length) return validationError(errs);

  const customerId  = parseInt(String(body.customerId));
  const customer    = await prisma.customer.findUnique({ where: { customerId } });
  if (!customer) return notFound("customer");
  if (customer.status === "Blacklisted") {
    return validationError([{ field: "customerId", issue: "Customer is blacklisted and cannot receive loans." }]);
  }

  const loanAmount         = Number(body.loanAmount);
  const interestRate       = Number(body.interestRate);
  const numberOfInstalments= parseInt(String(body.numberOfInstalments));
  const managementFeeRate  = body.managementFeeRate ? Number(body.managementFeeRate) : 5.5;
  const deductFeeUpfront   = Boolean(body.deductFeeUpfront);
  const firstPaymentDate   = String(body.firstPaymentDate);
  const disbursementDate   = String(body.disbursementDate);

  // Generate preview schedule (not yet persisted — done on approval)
  const schedule = generateLoanSchedule({
    loanAmount, interestRate, numberOfInstalments,
    managementFeeRate, deductFeeUpfront: deductFeeUpfront as any, firstPaymentDate,
  });

  // Sequential loan number
  const loanCount  = await prisma.loanPortfolio.count();
  const loanNumber = `LN-${new Date().getFullYear()}-${String(loanCount + 1).padStart(5, "0")}`;
  const maturityDate = computeMaturityDate(firstPaymentDate, numberOfInstalments);

  const loan = await prisma.loanPortfolio.create({
    data: {
      customerId,
      loanNumber,
      loanAmount,
      interestRate,
      numberOfInstalments,
      managementFeeRate,
      managementFeeAmount: schedule.summary.managementFeeAmount,
      deductFeeUpfront,
      totalDisbursed:      schedule.summary.totalDisbursed,
      monthlyPayment:      schedule.summary.monthlyPayment,
      totalInterest:       schedule.summary.totalInterest,
      totalManagementFees: schedule.summary.totalManagementFees,
      totalPayment:        schedule.summary.totalPayment,
      disbursementDate:    new Date(disbursementDate),
      firstPaymentDate:    new Date(firstPaymentDate),
      maturityDate:        new Date(maturityDate),
      purpose:             body.purpose ? String(body.purpose) : undefined,
      disbursementMethod:  (body.disbursementMethod as "BankTransfer" | "Cash" | "Cheque") ?? "BankTransfer",
      bankName:            body.bankName    ? String(body.bankName)    : undefined,
      accountNumber:       body.accountNumber ? String(body.accountNumber) : undefined,
      isTopup:             Boolean(body.topUp),
      topupSourceLoanId:   body.topUpLoanId ? parseInt(String(body.topUpLoanId)) : undefined,
      loanStatus:          "Pending_Approval",
      createdBy:           parseInt(req.user.sub),
      principalOutstanding: schedule.summary.totalDisbursed,
      totalOutstanding:    schedule.summary.totalDisbursed,
    },
  });

  // Create approval entry with full payload snapshot
  const approval = await prisma.pendingApproval.create({
    data: {
      actionType:     "CREATE_LOAN",
      entityType:     "loan",
      entityId:       loan.loanId,
      actionData:     JSON.stringify({ loanId: loan.loanId }),
      description:    `New loan application ${loanNumber} for customer ${customer.customerName}`,
      submittedBy:    req.user.sub,
      submittedByRole: req.user.role,
    },
  });

  return createdResponse({
    loan:            formatLoan({ ...loan, customer: { customerName: customer.customerName, customerCode: customer.customerCode } }),
    approvalId:      String(approval.approvalId),
    previewSchedule: schedule.instalments,
  });
}, ["Director", "MD", "Accountant", "Secretary", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;

export function formatLoan(l: Record<string, unknown>) {
  const customer = l.customer as { customerName?: string; customerCode?: string } | undefined;
  return {
    id:                  String(l.loanId),
    loanNumber:          l.loanNumber,
    customerId:          String(l.customerId),
    customerName:        customer?.customerName ?? "",
    loanAmount:          Number(l.loanAmount),
    managementFeeRate:   Number(l.managementFeeRate),
    managementFeeAmount: Number(l.managementFeeAmount),
    deductFeeUpfront:    l.deductFeeUpfront,
    totalDisbursed:      Number(l.totalDisbursed),
    interestRate:        Number(l.interestRate),
    numberOfInstalments: l.numberOfInstalments,
    monthlyPayment:      Number(l.monthlyPayment),
    totalInterest:       Number(l.totalInterest),
    totalManagementFees: Number(l.totalManagementFees),
    totalPayment:        Number(l.totalPayment),
    disbursementDate:    l.disbursementDate instanceof Date ? l.disbursementDate.toISOString().split("T")[0] : l.disbursementDate,
    firstPaymentDate:    l.firstPaymentDate instanceof Date ? l.firstPaymentDate.toISOString().split("T")[0] : l.firstPaymentDate,
    maturityDate:        l.maturityDate instanceof Date ? l.maturityDate.toISOString().split("T")[0] : l.maturityDate,
    purpose:             l.purpose,
    loanStatus:          l.loanStatus,
    disbursementMethod:  l.disbursementMethod,
    bankName:            l.bankName,
    accountNumber:       l.accountNumber,
    principalOutstanding: Number(l.principalOutstanding ?? 0),
    interestOutstanding: Number(l.interestOutstanding ?? 0),
    totalOutstanding:    Number(l.totalOutstanding ?? 0),
    totalPaid:           Number(l.totalPaid ?? 0),
    daysOverdue:         l.daysOverdue ?? 0,
    isTopup:             l.isTopup,
    createdBy:           l.createdBy,
    approvedBy:          l.approvedBy,
    approvedAt:          l.approvedAt instanceof Date ? l.approvedAt.toISOString() : l.approvedAt,
    createdAt:           l.createdAt instanceof Date ? l.createdAt.toISOString() : l.createdAt,
    updatedAt:           l.updatedAt instanceof Date ? l.updatedAt.toISOString() : l.updatedAt,
  };
}
