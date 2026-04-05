import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";

// GET /api/reports/income-statement
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date(new Date().getFullYear(), 0, 1);
  const to   = searchParams.get("to")   ? new Date(searchParams.get("to")!)   : new Date();

  const accounts = await prisma.chartOfAccount.findMany({
    where:   { isActive: true, class: "Income Statement" },
    orderBy: { accountCode: "asc" },
  });

  const withBalances = await Promise.all(
    accounts.map(async (a) => {
      const entries = await prisma.ledger.findMany({
        where: { accountCode: a.accountCode, transactionDate: { gte: from, lte: to } },
      });
      const totalDebit  = entries.reduce((s, e) => s + Number(e.debitAmount),  0);
      const totalCredit = entries.reduce((s, e) => s + Number(e.creditAmount), 0);
      const balance = a.normalBalance === "Credit"
        ? totalCredit - totalDebit
        : totalDebit - totalCredit;

      return {
        code:     a.accountCode,
        name:     a.accountName,
        type:     a.accountType ?? "",
        balance,
      };
    })
  );

  const revenue  = withBalances.filter((a) => a.type === "Revenue");
  const expenses = withBalances.filter((a) => a.type === "Expense");

  const totalRevenue   = revenue.reduce((s, a)  => s + a.balance, 0);
  const totalExpenses  = expenses.reduce((s, a) => s + a.balance, 0);
  const netIncome      = totalRevenue - totalExpenses;

  return successResponse({
    period:       { from: from.toISOString().split("T")[0], to: to.toISOString().split("T")[0] },
    revenue,
    expenses,
    summary: {
      totalRevenue,
      totalExpenses,
      netIncome,
    },
  });
}) as unknown as (req: NextRequest) => Promise<Response>;
