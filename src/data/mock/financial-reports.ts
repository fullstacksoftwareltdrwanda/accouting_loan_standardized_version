import { 
  TrialBalanceReport, 
  BalanceSheetReport, 
  IncomeStatementReport,
  IncomeAnalysisReport
} from "@/types/report";

export const MOCK_TRIAL_BALANCE: TrialBalanceReport = {
  period: "April 01, 2026 to April 02, 2026",
  items: [
    // BALANCE SHEET ACCOUNTS
    { accountCode: "2101", accountName: "Accounts Payable", group: "Balance Sheet", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "2103", accountName: "Accrued Salaries", group: "Balance Sheet", openingBalance: { initial: 0, debit: 180000, credit: 1564000 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: -1384000, final: -1384000 } },
    { accountCode: "2104", accountName: "Accrued Withholding Tax Payable", group: "Balance Sheet", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "2107", accountName: "Accrued Pension", group: "Balance Sheet", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "2108", accountName: "Accrued Maternity Leave", group: "Balance Sheet", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "2109", accountName: "Accrued Mutuel", group: "Balance Sheet", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "2201", accountName: "Loan Payable - Banks", group: "Balance Sheet", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "2202", accountName: "Loan Payable - Other Institutions", group: "Balance Sheet", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "2402", accountName: "Deferred Monitoring Fees", group: "Balance Sheet", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "2408", accountName: "Loan Overpayment Liability", group: "Balance Sheet", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "2409", accountName: "Refunds Payable", group: "Balance Sheet", openingBalance: { initial: 0, debit: 180000, credit: 1564000 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: -1384000, final: -1384000 } },
    { accountCode: "3001", accountName: "Capital", group: "Balance Sheet", openingBalance: { initial: -10000000, debit: 0, credit: 10000000 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: -10000000, final: -10000000 } },
    { accountCode: "3104", accountName: "Capital Reserve", group: "Balance Sheet", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    
    // EQUITY ACCOUNTS
    { accountCode: "3102", accountName: "Retained Earnings", group: "Equity", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 210, final: 210 } },
    { accountCode: "3101", accountName: "Current Period Earnings/Loss", group: "Equity", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "3999", accountName: "System Reconciliation (Portfolio Adjustment)", group: "Equity", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: -5001290, final: -5001290 } },

    // INCOME STATEMENT ACCOUNTS
    { accountCode: "4101", accountName: "Interest Income", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "4201", accountName: "Management Fee Income", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "4202", accountName: "Disbursement Management Fee Income", group: "Income Statement", openingBalance: { initial: -100000, debit: 0, credit: 100000 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: -100000, final: -100000 } },
    { accountCode: "4204", accountName: "Application Fees", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "4205", accountName: "Penalty Charges", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "4301", accountName: "Impairment Recovery (Provision Reversal Income)", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5001", accountName: "Cleaning & Sanitation Expense", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5002", accountName: "Security Expense", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5003", accountName: "Internet Expence", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5004", accountName: "fee Charges", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5005", accountName: "Office Equipment Maintenance", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5006", accountName: "Relocation expenses", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5007", accountName: "Recovery Expense", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5008", accountName: "Board of Directors Allowances", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5009", accountName: "Board Meeting Expenses", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5010", accountName: "Software Development Expense", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5101", accountName: "Salaries & Wages", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5102", accountName: "Staff Training & Development", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5103", accountName: "Transport & Travel", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5104", accountName: "Rent", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
    { accountCode: "5107", accountName: "Communication (Internet, Phone)", group: "Income Statement", openingBalance: { initial: 0, debit: 0, credit: 0 }, movements: { debit: 0, credit: 0 }, closingBalance: { balance: 0, final: 0 } },
  ],
  totals: {
    opening: 0,
    movementsDebit: 0,
    movementsCredit: 0,
    closing: 10100000
  },
  grandTotals: {
    initial: 4901500,
    openingDebit: 15001500,
    openingCredit: 10100000,
    balance: -100000,
    final: -100000
  }
};

export const MOCK_BALANCE_SHEET: BalanceSheetReport = {
  date: "April 02, 2026",
  assets: [
    {
      title: "BALANCE SHEET",
      total: 15001500,
      items: [
        { code: "1101", name: "Cash on hand", amount: 10001500 },
        { code: "1201", name: "Loans to Customers", amount: 5000000 },
      ]
    }
  ],
  liabilities: [
    {
      title: "BALANCE SHEET",
      total: 0,
      items: [
        { code: "2101", name: "Accounts Payable", amount: 0 },
      ]
    }
  ],
  equity: [
    {
      title: "BALANCE SHEET",
      total: 10000000,
      items: [
        { code: "3001", name: "Capital", amount: 10000000 },
      ]
    },
    {
      title: "EQUITY",
      total: 5001500,
      items: [
        { code: "3102", name: "Retained Earnings", amount: 210 },
        { code: "3999", name: "System Reconciliation (Portfolio Adjustment)", amount: 5001290 },
      ]
    }
  ],
  summary: {
    totalAssets: 15001500,
    totalLiabilities: 0,
    totalEquity: 15001500
  }
};

export const MOCK_INCOME_STATEMENT: IncomeStatementReport = {
  period: "April 01, 2026 to April 02, 2026",
  revenue: [
    {
      title: "FEE INCOME",
      total: 0,
      items: [
        { code: "4202", name: "Disbursement Management Fee Income", amount: 0 }
      ]
    },
    {
      title: "INCOME STATEMENT",
      total: 0,
      items: [
        { code: "4101", name: "Interest Income", amount: 0 },
        { code: "4201", name: "Management Fee Income", amount: 0 },
        { code: "4204", name: "Application Fees", amount: 0 },
        { code: "4205", name: "Penalty Charges", amount: 0 },
        { code: "4301", name: "Impairment Recovery (Provision Reversal Income)", amount: 0 },
      ]
    }
  ],
  expenses: [
    {
      title: "INCOME STATEMENT",
      total: 0,
      items: [
        { code: "5001", name: "Cleaning & Sanitation Expense", amount: 0 },
        { code: "5002", name: "Security Expense", amount: 0 },
        { code: "5003", name: "Internet Expence", amount: 0 },
        { code: "5004", name: "fee Charges", amount: 0 },
        { code: "5005", name: "Office Equipment Maintenance", amount: 0 },
        { code: "5006", name: "Relocation expenses", amount: 0 },
        { code: "5007", name: "Recovery Expense", amount: 0 },
        { code: "5008", name: "Board of Directors Allowances", amount: 0 },
        { code: "5009", name: "Board Meeting Expenses", amount: 0 },
        { code: "5010", name: "Software Development Expense", amount: 0 },
        { code: "5101", name: "Salaries & Wages", amount: 0 },
        { code: "5102", name: "Staff Training & Development", amount: 0 },
        { code: "5103", name: "Transport & Travel", amount: 0 },
        { code: "5104", name: "Rent", amount: 0 },
        { code: "5107", name: "Communication (Internet, Phone)", amount: 0 },
      ]
    }
  ],
  netIncome: 0
};

export const MOCK_INCOME_ANALYSIS: IncomeAnalysisReport = {
  period: "April 01, 2026 to April 02, 2026",
  items: [
    {
      customerName: "Test User",
      loanNumber: "LN-20260331-102807",
      period: {
        interest: 0,
        periodicMgmt: 0,
        disbMgmtFee: 0,
        penalties: 0
      },
      allTime: {
        totalInterest: 0,
        totalPeriodicMgmt: 0,
        totalDisbFee: 100000
      },
      remaining: {
        interestLeft: 910520,
        mgmtFeeLeft: 500000
      }
    }
  ],
  totals: {
    periodInterest: 0,
    periodPeriodicMgmt: 0,
    periodDisbMgmtFee: 0,
    periodPenalties: 0,
    allTimeInterest: 0,
    allTimePeriodicMgmt: 0,
    allTimeDisbFee: 100000,
    remainingInterest: 910520,
    remainingMgmtFee: 500000
  }
};
