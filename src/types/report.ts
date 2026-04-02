export type ReportStatus = "draft" | "ready" | "processing";
export type ReportCategory = "Financial" | "Operational" | "Compliance";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ReportStatus;
  format: string;
  lastGenerated?: string;
  size?: string;
}

export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  group: string;
  openingBalance: { initial: number; debit: number; credit: number };
  movements: { debit: number; credit: number };
  closingBalance: { balance: number; final: number };
}

export interface TrialBalanceReport {
  period: string;
  items: TrialBalanceItem[];
  totals: {
    opening: number;
    movementsDebit: number;
    movementsCredit: number;
    closing: number;
  };
  grandTotals: {
    initial: number;
    openingDebit: number;
    openingCredit: number;
    balance: number;
    final: number;
  };
}

export interface BalanceSheetItem {
  code: string;
  name: string;
  amount: number;
}

export interface BalanceSheetSection {
  title: string;
  items: BalanceSheetItem[];
  total: number;
}

export interface BalanceSheetReport {
  date: string;
  assets: BalanceSheetSection[];
  liabilities: BalanceSheetSection[];
  equity: BalanceSheetSection[];
  summary: {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
  };
}

export interface IncomeStatementItem {
  code: string;
  name: string;
  amount: number;
}

export interface IncomeStatementSection {
  title: string;
  items: IncomeStatementItem[];
  total: number;
}

export interface IncomeStatementReport {
  period: string;
  revenue: IncomeStatementSection[];
  expenses: IncomeStatementSection[];
  netIncome: number;
}
export interface IncomeAnalysisItem {
  customerName: string;
  loanNumber: string;
  period: {
    interest: number;
    periodicMgmt: number;
    disbMgmtFee: number;
    penalties: number;
  };
  allTime: {
    totalInterest: number;
    totalPeriodicMgmt: number;
    totalDisbFee: number;
  };
  remaining: {
    interestLeft: number;
    mgmtFeeLeft: number;
  };
}

export interface IncomeAnalysisReport {
  period: string;
  items: IncomeAnalysisItem[];
  totals: {
    periodInterest: number;
    periodPeriodicMgmt: number;
    periodDisbMgmtFee: number;
    periodPenalties: number;
    allTimeInterest: number;
    allTimePeriodicMgmt: number;
    allTimeDisbFee: number;
    remainingInterest: number;
    remainingMgmtFee: number;
  };
}
