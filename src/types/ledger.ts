export interface JournalLine {
  id: string;
  accountId: string;
  accountName: string;
  narration: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  voucherNumber: string;
  status: "draft" | "posted" | "void";
  lines: JournalLine[];
}

export interface LedgerTransaction {
  id: string;
  date: string;
  accountClass: string;
  accountName: string;
  voucherNumber: string;
  particulars: string;
  beginningBalance: number;
  debit: number;
  credit: number;
  movement: number;
  endingBalance: number;
}
