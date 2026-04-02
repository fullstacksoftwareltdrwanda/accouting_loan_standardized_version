import { JournalEntry } from "@/types/ledger";
import { MOCK_LEDGER_ENTRIES } from "@/data/mock/ledger";

/**
 * LEDGER SERVICE: Production-ready backend skeleton.
 * Standardizing for NestJS/Prisma double-entry sync.
 */

export async function getLedgerEntries(): Promise<JournalEntry[]> {
  // TODO: Replace with backend API call (Sorted by date DESC)
  await new Promise((resolve) => setTimeout(resolve, 600));
  return [...MOCK_LEDGER_ENTRIES];
}

export async function createLedgerEntry(data: Partial<JournalEntry>): Promise<JournalEntry> {
  // TODO: POST to backend
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Journalizing entry...", data);
  return { ...data, id: Math.random().toString(36).substr(2, 9) } as JournalEntry;
}
