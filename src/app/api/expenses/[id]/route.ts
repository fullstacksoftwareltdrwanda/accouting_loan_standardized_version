import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, validationError } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/expenses/[id]
export const PUT = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const expenseId = parseInt(ctx.params.id);
  const expense = await prisma.expense.findUnique({ where: { expenseId } });
  if (!expense) return notFound("expense");

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const updated = await prisma.expense.update({
    where: { expenseId },
    data: {
      expenseDate:  body.expenseDate  ? new Date(String(body.expenseDate)) : undefined,
      expenseAmount: body.expenseAmount ? Number(body.expenseAmount)         : undefined,
      category:     body.category     ? String(body.category)              : undefined,
      vendor:       body.vendor       ? String(body.vendor)                : undefined,
      description:  body.description  ? String(body.description)           : undefined,
    },
  });

  return successResponse({ expense: updated });
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;

// DELETE /api/expenses/[id]
export const DELETE = withAuth(async (_req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const expenseId = parseInt(ctx.params.id);
  const expense = await prisma.expense.findUnique({ where: { expenseId } });
  if (!expense) return notFound("expense");

  await prisma.expense.delete({ where: { expenseId } });
  // Ledger entries associated with this expense are kept for audit trail

  return successResponse({ success: true });
}, ["Director", "MD", "Developer"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
