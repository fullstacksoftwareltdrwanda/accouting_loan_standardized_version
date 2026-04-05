/**
 * Report Service — real API implementation.
 * Replaces src/services/mock/report.service.ts
 */
import { api } from "@/lib/api-client";
import { 
  TrialBalanceReport, 
  BalanceSheetReport, 
  IncomeStatementReport,
  IncomeAnalysisReport
} from "@/types/report";

export async function getTrialBalance(params?: { from?: string; asOf?: string }): Promise<TrialBalanceReport> {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  const result = await api.get<{ asOf: string; items: any[]; totals: any }>(`/api/reports/trial-balance${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch trial balance");
  
  const data = result.data!;
  return {
    period: data.asOf,
    items: data.items.map(i => ({
      accountCode: i.accountCode,
      accountName: i.accountName,
      group: i.class || "N/A",
      openingBalance: { initial: i.openingBalance, debit: 0, credit: 0 },
      movements: i.movements,
      closingBalance: { balance: i.closingBalance, final: i.closingBalance }
    })),
    totals: {
      opening: data.items.reduce((s: number, i: any) => s + i.openingBalance, 0),
      movementsDebit: data.totals.movementsDebit,
      movementsCredit: data.totals.movementsCredit,
      closing: data.items.reduce((s: number, i: any) => s + i.closingBalance, 0),
    },
    grandTotals: {
      initial: data.items.reduce((s: number, i: any) => s + i.openingBalance, 0),
      openingDebit: 0,
      openingCredit: 0,
      balance: data.totals.movementsDebit - data.totals.movementsCredit,
      final: data.items.reduce((s: number, i: any) => s + i.closingBalance, 0),
    }
  };
}

export async function getBalanceSheet(params?: { asOf?: string }): Promise<BalanceSheetReport> {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  const result = await api.get<any>(`/api/reports/balance-sheet${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch balance sheet");
  
  // Minimal mapping for now, should match UI structure
  return result.data!;
}

export async function getIncomeStatement(params?: { from?: string; to?: string }): Promise<IncomeStatementReport> {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  const result = await api.get<any>(`/api/reports/income-statement${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch income statement");
  
  return result.data!;
}

export async function getIncomeAnalysis(params?: { from?: string; to?: string }): Promise<IncomeAnalysisReport> {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  const result = await api.get<any>(`/api/reports/income-analysis${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch income analysis");
  return result.data!;
}

export async function getPortfolioReport(params?: { asOf?: string }): Promise<any> {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  const result = await api.get<any>(`/api/reports/portfolio${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch portfolio report");
  return result.data!;
}

export async function getOverdueReport(params?: { minDays?: number }): Promise<any> {
  const qs = params ? "?" + new URLSearchParams(Object.fromEntries(
    Object.entries(params || {}).map(([k, v]) => [k, String(v)])
  )).toString() : "";
  const result = await api.get<any>(`/api/reports/overdue${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch overdue report");
  return result.data;
}

export async function getCashFlowStatement(params?: { from?: string; to?: string }): Promise<any> {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  const result = await api.get<any>(`/api/reports/cash-flow${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch cash flow statement");
  return result.data;
}

export async function generateReport(reportId: string): Promise<any> {
  const result = await api.post<any>(`/api/reports/${reportId}/generate`, {});
  if (!result.success) throw new Error(result.error?.message ?? "Failed to generate report");
  return result.data;
}

export async function downloadReport(reportId: string): Promise<void> {
  // In a real app, this would be a window.location.href or a blob download
  console.log(`Downloading report ${reportId}...`);
  window.open(`/api/reports/${reportId}/download`, "_blank");
}
