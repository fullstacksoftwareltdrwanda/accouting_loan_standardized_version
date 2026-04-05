import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";

// GET /api/reports/trial-balance
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const asOfDate = searchParams.get("asOf") ? new Date(searchParams.get("asOf")!) : new Date();
  const from     = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
  const to       = asOfDate;

  // Get all active accounts
  const accounts = await prisma.chartOfAccount.findMany({
    where:   { isActive: true },
    orderBy: { accountCode: "asc" },
  });

  const items = await Promise.all(
    accounts.map(async (acct) => {
      const ledgerEntries = await prisma.ledger.findMany({
        where: { accountCode: acct.accountCode },
        orderBy: { sequenceNumber: "asc" },
      });

      // Opening: sum of all entries before 'from' date
      const openingEntries = from
        ? ledgerEntries.filter((e) => e.transactionDate < from)
        : [];
      const openingDebit  = openingEntries.reduce((s, e) => s + Number(e.debitAmount),  0);
      const openingCredit = openingEntries.reduce((s, e) => s + Number(e.creditAmount), 0);
      const openingBalance = acct.normalBalance === "Debit"
        ? openingDebit - openingCredit
        : openingCredit - openingDebit;

      // Movements: entries within period
      const periodEntries = ledgerEntries.filter((e) => {
        const d = e.transactionDate;
        return (!from || d >= from) && d <= to;
      });
      const periodDebit  = periodEntries.reduce((s, e) => s + Number(e.debitAmount),  0);
      const periodCredit = periodEntries.reduce((s, e) => s + Number(e.creditAmount), 0);
      const closingBalance = openingBalance + (
        acct.normalBalance === "Debit"
          ? periodDebit - periodCredit
          : periodCredit - periodDebit
      );

      return {
        accountCode:   acct.accountCode,
        accountName:   acct.accountName,
        class:         acct.class,
        normalBalance: acct.normalBalance,
        period:        { from: from?.toISOString().split("T")[0] ?? null, to: to.toISOString().split("T")[0] },
        openingBalance,
        movements:     { debit: periodDebit, credit: periodCredit },
        closingBalance,
      };
    })
  );

  // Grand totals
  const totalDebits   = items.reduce((s, i) => s + i.movements.debit,  0);
  const totalCredits  = items.reduce((s, i) => s + i.movements.credit, 0);

  return successResponse({
    asOf:         to.toISOString().split("T")[0],
    items:        items.filter((i) => i.openingBalance !== 0 || i.movements.debit !== 0 || i.movements.credit !== 0),
    totals:       { movementsDebit: totalDebits, movementsCredit: totalCredits },
    isBalanced:   Math.abs(totalDebits - totalCredits) < 1,
  });
}) as unknown as (req: NextRequest) => Promise<Response>;
