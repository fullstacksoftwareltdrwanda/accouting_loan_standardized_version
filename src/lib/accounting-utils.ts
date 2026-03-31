import { Decimal } from "decimal.js";

/**
 * Validates the double-entry balancing of a ledger transaction block.
 * In a balanced double-entry system, Sum(Debits) must equal Sum(Credits).
 */
export function isBalanced(entries: { debitAmount: number | Decimal; creditAmount: number | Decimal }[]): boolean {
  const totalDebit = entries.reduce((sum, entry) => sum.plus(new Decimal(entry.debitAmount.toString())), new Decimal(0));
  const totalCredit = entries.reduce((sum, entry) => sum.plus(new Decimal(entry.creditAmount.toString())), new Decimal(0));
  
  return totalDebit.equals(totalCredit);
}

/**
 * Calculates current balance for any account based on its normal balance type.
 * Asset/Expense: Debit - Credit
 * Liability/Equity/Revenue: Credit - Debit
 */
export function calculateAccountBalance(
  debits: number | Decimal,
  credits: number | Decimal,
  normalBalance: "Debit" | "Credit"
): Decimal {
  const d = new Decimal(debits.toString());
  const c = new Decimal(credits.toString());
  
  return normalBalance === "Debit" ? d.minus(c) : c.minus(d);
}

/**
 * Standard GL account codes for Grace Lending reference:
 * 1101: Cash
 * 1102: Bank
 * 1201: Loans to Customers
 * 4101: Interest Income
 * 2402: Deferred Monitoring Fees
 */
export const ACCOUNT_CODES = {
  CASH: "1101",
  BANK: "1102",
  LOANS: "1201",
  INTEREST_INCOME: "4101",
  MGMT_FEES: "4201",
  PENALTIES: "4205",
} as const;
