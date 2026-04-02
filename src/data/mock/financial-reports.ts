import { TrialBalanceReport, BalanceSheetReport, IncomeStatementReport, IncomeAnalysisReport } from "@/types/report";

/**
 * PRODUCTION RESET: Cleared all financial report data.
 * All statements now default to 0.00.
 */

export const MOCK_TRIAL_BALANCE: TrialBalanceReport = {
  period: "As of Today",
  items: [],
  totals: {
    opening: 0,
    movementsDebit: 0,
    movementsCredit: 0,
    closing: 0
  },
  grandTotals: {
    initial: 0,
    openingDebit: 0,
    openingCredit: 0,
    balance: 0,
    final: 0
  }
};

export const MOCK_BALANCE_SHEET: BalanceSheetReport = {
  date: "Today",
  assets: [],
  liabilities: [],
  equity: [],
  summary: {
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0
  }
};

export const MOCK_INCOME_STATEMENT: IncomeStatementReport = {
  period: "Current Period",
  revenue: [],
  expenses: [],
  netIncome: 0
};

export const MOCK_INCOME_ANALYSIS: IncomeAnalysisReport = {
  period: "Current Portfolio Analysis",
  items: [],
  totals: {
    periodInterest: 0,
    periodPeriodicMgmt: 0,
    periodDisbMgmtFee: 0,
    periodPenalties: 0,
    allTimeInterest: 0,
    allTimePeriodicMgmt: 0,
    allTimeDisbFee: 0,
    remainingInterest: 0,
    remainingMgmtFee: 0
  }
};
