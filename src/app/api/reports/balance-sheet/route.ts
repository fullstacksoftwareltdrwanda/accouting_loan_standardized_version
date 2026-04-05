import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";

// GET /api/reports/balance-sheet
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const asOf = searchParams.get("asOf") ? new Date(searchParams.get("asOf")!) : new Date();

  const accounts = await prisma.chartOfAccount.findMany({
    where: { isActive: true },
    orderBy: { accountCode: "asc" },
  });

  const getAccountBalance = async (accountCode: string, normalBalance: string | null) => {
    const last = await prisma.ledger.findFirst({
      where:   { accountCode, transactionDate: { lte: asOf } },
      orderBy: [{ transactionDate: "desc" }, { sequenceNumber: "desc" }],
    });
    return last ? Number(last.endingBalance) : 0;
  };

  const bsAccounts = accounts.filter((a) => a.class === "Balance Sheet");

  const withBalances = await Promise.all(
    bsAccounts.map(async (a) => ({
      code:    a.accountCode,
      name:    a.accountName,
      type:    a.accountType ?? "",
      balance: await getAccountBalance(a.accountCode, a.normalBalance),
    }))
  );

  const assets      = withBalances.filter((a) => a.type === "Asset");
  const liabilities = withBalances.filter((a) => a.type === "Liability");
  const equity      = withBalances.filter((a) => a.type === "Equity");

  const totalAssets      = assets.reduce((s, a)      => s + a.balance, 0);
  const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);
  const totalEquity      = equity.reduce((s, a)      => s + a.balance, 0);

  // Retained earnings adjustment = net income from income statement accounts
  const incomeAccounts = accounts.filter((a) => a.class === "Income Statement");
  const netIncome = await incomeAccounts.reduce(async (accP, a) => {
    const acc  = await accP;
    const bal  = await getAccountBalance(a.accountCode, a.normalBalance);
    return a.accountType === "Revenue" ? acc + bal : acc - bal;
  }, Promise.resolve(0));

  return successResponse({
    date:             asOf.toISOString().split("T")[0],
    assets:           groupBy(assets,      "type"),
    liabilities:      groupBy(liabilities, "type"),
    equity:           equity,
    summary: {
      totalAssets,
      totalLiabilities,
      totalEquity: totalEquity + netIncome,
      netIncome,
      isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity + netIncome)) < 1,
    },
  });
}) as unknown as (req: NextRequest) => Promise<Response>;

function groupBy(items: { code: string; name: string; type: string; balance: number }[], _key: string) {
  return items;
}
