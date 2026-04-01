import { LedgerTransaction, JournalEntry } from "@/types/ledger";
import { MOCK_LEDGER_TRANSACTIONS, MOCK_RECENT_ENTRIES } from "@/data/mock/ledger";

export async function getLedgerTransactions(): Promise<LedgerTransaction[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...MOCK_LEDGER_TRANSACTIONS].reverse();
}

export async function getRecentJournalEntries(): Promise<JournalEntry[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...MOCK_RECENT_ENTRIES];
}

export async function saveJournalEntry(entry: Partial<JournalEntry>): Promise<JournalEntry> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Calculate total debits and credits to ensure it balances before saving
  const totalDebits = entry.lines?.reduce((sum, line) => sum + (Number(line.debit) || 0), 0) || 0;
  const totalCredits = entry.lines?.reduce((sum, line) => sum + (Number(line.credit) || 0), 0) || 0;

  if (Math.abs(totalDebits - totalCredits) > 0.01) {
    throw new Error("Journal entry must balance. Total Debits must equal Total Credits.");
  }

  const newEntry: JournalEntry = {
    id: `je_${Math.random().toString(36).substr(2, 9)}`,
    date: entry.date || new Date().toISOString().split('T')[0],
    voucherNumber: entry.voucherNumber || `JV-${Math.floor(Math.random() * 100000)}`,
    status: "posted",
    lines: entry.lines || []
  };

  return newEntry;
}
