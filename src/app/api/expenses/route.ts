import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, createdResponse, notFound, validationError, buildPaginationMeta } from "@/lib/api-response";
import { createExpenseEntries } from "@/helpers/accounting-functions";

// GET /api/expenses
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const from     = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
  const to       = searchParams.get("to")   ? new Date(searchParams.get("to")!)   : undefined;
  const category = searchParams.get("category") ?? undefined;
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage  = 25;

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (from || to) where.expenseDate = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };

  const [total, expenses] = await Promise.all([
    prisma.expense.count({ where }),
    prisma.expense.findMany({ where, skip: (page - 1) * perPage, take: perPage, orderBy: { expenseDate: "desc" } }),
  ]);

  return successResponse(
    { expenses: expenses.map(formatExpense) },
    buildPaginationMeta(total, page, perPage)
  );
}) as unknown as (req: NextRequest) => Promise<Response>;

// POST /api/expenses
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];
  if (!body.expenseDate)          errs.push({ field: "expenseDate",   issue: "Required" });
  if (!body.accountCode)          errs.push({ field: "accountCode",   issue: "Required — GL expense account" });
  if (!body.paymentAccountCode)   errs.push({ field: "paymentAccountCode", issue: "Required — GL cash/bank account" });
  if (body.expenseAmount === undefined) errs.push({ field: "expenseAmount", issue: "Required" });
  if (errs.length) return validationError(errs);

  const count = await prisma.expense.count();
  const expenseReference = `EXP-${String(count + 1).padStart(6, "0")}`;

  // Lookup account names from DB
  const [expAcct, payAcct] = await Promise.all([
    prisma.chartOfAccount.findUnique({ where: { accountCode: String(body.accountCode) } }),
    prisma.chartOfAccount.findUnique({ where: { accountCode: String(body.paymentAccountCode) } }),
  ]);
  if (!expAcct) return validationError([{ field: "accountCode",       issue: "Account not found in chart of accounts" }]);
  if (!payAcct) return validationError([{ field: "paymentAccountCode", issue: "Account not found in chart of accounts" }]);

  const expense = await prisma.expense.create({
    data: {
      expenseReference,
      expenseDate:       new Date(String(body.expenseDate)),
      accountCode:       String(body.accountCode),
      accountName:       expAcct.accountName,
      paymentAccountCode: String(body.paymentAccountCode),
      expenseAmount:     Number(body.expenseAmount),
      paymentType:       (body.paymentType as "Cash" | "Bank" | "Mobile_Money") ?? "Bank",
      category:          body.category  ? String(body.category)  : undefined,
      vendor:            body.vendor    ? String(body.vendor)    : undefined,
      description:       body.description ? String(body.description) : undefined,
      createdBy:         parseInt(req.user.sub),
    },
  });

  // Post ledger entries
  await createExpenseEntries(
    prisma,
    {
      expenseId:   expense.expenseId,
      date:        expense.expenseDate,
      amount:      Number(expense.expenseAmount),
      description: expense.description ?? expenseReference,
      createdBy:   parseInt(req.user.sub),
    },
    {
      expenseAccountCode: String(body.accountCode),
      paymentAccountCode: String(body.paymentAccountCode),
    }
  );

  return createdResponse({ expense: formatExpense(expense as unknown as Record<string, unknown>) });
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;

function formatExpense(e: Record<string, unknown>) {
  return {
    id:               String(e.expenseId),
    expenseReference: e.expenseReference,
    expenseDate:      e.expenseDate instanceof Date ? e.expenseDate.toISOString().split("T")[0] : e.expenseDate,
    accountCode:      e.accountCode,
    accountName:      e.accountName,
    paymentAccountCode: e.paymentAccountCode,
    expenseAmount:    Number(e.expenseAmount),
    paymentType:      e.paymentType,
    category:         e.category,
    vendor:           e.vendor,
    description:      e.description,
    createdAt:        e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
  };
}
