/**
 * Ledger Service — real API implementation.
 * Replaces src/services/mock/ledger.service.ts
 */
import { api } from "@/lib/api-client";

export async function getLedgerEntries(filters?: Record<string, unknown>): Promise<{ entries: any[], totals: { debit: number, credit: number }, meta?: any }> {
  const qs = filters ? "?" + new URLSearchParams(filters as Record<string, string>).toString() : "";
  const result = await api.get<{ entries: any[], totals: { debit: number, credit: number } }>(`/api/ledger${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch ledger entries");
  
  const entries = result.data!.entries.map((e: any) => ({
    id: String(e.id),
    date: e.transactionDate,
    accountCode: e.accountCode,
    accountName: e.accountName || "Unknown",
    accountClass: e.class || "Asset",
    voucherNumber: e.voucherNumber || `VCH-${e.id}`,
    particulars: e.particular || e.narration,
    beginningBalance: Number(e.beginningBalance),
    debit: Number(e.debitAmount), // Matching model field name
    credit: Number(e.creditAmount),
    movement: Number(e.movement),
    endingBalance: Number(e.endingBalance)
  }));

  return { entries, totals: result.data!.totals, meta: result.meta };
}

export async function postManualJournal(data: {
  date: string;
  description: string;
  reference?: string;
  lines: {
    accountCode: string;
    particular: string;
    narration?: string;
    debitAmount: number;
    creditAmount: number;
  }[];
}) {
  const result = await api.post<{ journalEntry: unknown }>("/api/ledger", data);
  if (!result.success) throw new Error(result.error?.message ?? "Journal entry failed");
  return result.data!.journalEntry;
}

export async function getAccountStatement(code: string, params?: { from?: string; to?: string }) {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  const result = await api.get<unknown>(`/api/ledger/account/${code}/statement${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch account statement");
  return result.data;
}
