import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound } from "@/lib/api-response";

type Ctx = { params: Promise<{ code: string }> };

// GET /api/ledger/account/[code]/statement
export const GET = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const { code } = ctx.params;
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
  const to   = searchParams.get("to")   ? new Date(searchParams.get("to")!)   : new Date();

  const account = await prisma.chartOfAccount.findUnique({ where: { accountCode: code } });
  if (!account) return notFound("account");

  const entries = await prisma.ledger.findMany({
    where: {
      accountCode: code,
      ...(from ? { transactionDate: { gte: from, lte: to } } : {}),
    },
    orderBy: [{ transactionDate: "asc" }, { sequenceNumber: "asc" }],
  });

  const openingBalance = entries.length > 0 ? Number(entries[0].beginningBalance) : 0;
  const closingBalance = entries.length > 0 ? Number(entries[entries.length - 1].endingBalance) : 0;
  const totalDebits    = entries.reduce((s, e) => s + Number(e.debitAmount),  0);
  const totalCredits   = entries.reduce((s, e) => s + Number(e.creditAmount), 0);

  return successResponse({
    account: {
      code:          account.accountCode,
      name:          account.accountName,
      class:         account.class,
      normalBalance: account.normalBalance,
    },
    period: {
      from: from?.toISOString().split("T")[0] ?? null,
      to:   to.toISOString().split("T")[0],
    },
    openingBalance,
    closingBalance,
    totalDebits,
    totalCredits,
    entries: entries.map((e) => ({
      date:     e.transactionDate.toISOString().split("T")[0],
      particular: e.particular,
      narration:  e.narration,
      debit:    Number(e.debitAmount),
      credit:   Number(e.creditAmount),
      balance:  Number(e.endingBalance),
    })),
  });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
