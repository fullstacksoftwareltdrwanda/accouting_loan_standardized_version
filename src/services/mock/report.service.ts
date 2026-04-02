import { Report, TrialBalanceReport, BalanceSheetReport, IncomeStatementReport, IncomeAnalysisReport } from "@/types/report";
import { MOCK_REPORTS } from "@/data/mock/reports";
import { 
  MOCK_TRIAL_BALANCE, 
  MOCK_BALANCE_SHEET, 
  MOCK_INCOME_STATEMENT, 
  MOCK_INCOME_ANALYSIS 
} from "@/data/mock/financial-reports";

/**
 * REPORT SERVICE: Production-ready backend skeleton.
 * Ready for heavy-duty analytics and aggregation logic.
 */

export async function getReports(): Promise<Report[]> {
  // Metadata for report types remains frontend-local or from DB
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_REPORTS];
}

export async function getTrialBalance(): Promise<TrialBalanceReport> {
  // TODO: Aggregate from Ledger entries in Prisma/NestJS
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ...MOCK_TRIAL_BALANCE };
}

export async function getBalanceSheet(): Promise<BalanceSheetReport> {
  // TODO: Aggregate from Ledger entries
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ...MOCK_BALANCE_SHEET };
}

export async function getIncomeStatement(): Promise<IncomeStatementReport> {
  // TODO: Aggregate from Revenues/Expenses
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ...MOCK_INCOME_STATEMENT };
}

export async function getIncomeAnalysis(): Promise<IncomeAnalysisReport> {
  // TODO: Aggregate from Active Loans
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ...MOCK_INCOME_ANALYSIS };
}

export async function generateReport(id: string): Promise<boolean> {
  // TODO: Trigger backend background job
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`Generating report ${id} for download...`);
  return true;
}

export async function downloadReport(id: string): Promise<void> {
  // TODO: Trigger direct download from S3/Storage
  console.log(`Downloading report ${id} file...`);
}
