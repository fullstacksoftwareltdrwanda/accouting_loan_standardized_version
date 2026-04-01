import { LedgerTransaction, JournalEntry } from "@/types/ledger";

// Unified Ledger Output for the Table
export const MOCK_LEDGER_TRANSACTIONS: LedgerTransaction[] = [
  {
    id: "tx_1",
    date: "30/03/2026",
    accountClass: "1101 Assets",
    accountName: "Cash in Hand",
    voucherNumber: "CUST-28/03/26/18/04/52",
    particulars: "Loan Payment Received",
    beginningBalance: 0.00,
    debit: 1500.00,
    credit: 0.00,
    movement: 1500.00,
    endingBalance: 1500.00
  },
  {
    id: "tx_2",
    date: "30/03/2026",
    accountClass: "1201 Assets",
    accountName: "Loans to Customers",
    voucherNumber: "CUST-28/03/26/18/04/52",
    particulars: "Principal Repayment",
    beginningBalance: 0.00,
    debit: 0.00,
    credit: 1290.00,
    movement: -1290.00,
    endingBalance: -1290.00
  },
  {
    id: "tx_3",
    date: "30/03/2026",
    accountClass: "4101 Revenue",
    accountName: "Interest on Loans",
    voucherNumber: "CUST-28/03/26/18/04/52",
    particulars: "Interest Income",
    beginningBalance: 0.00,
    debit: 0.00,
    credit: 100.00,
    movement: 100.00,
    endingBalance: 100.00
  },
  {
    id: "tx_4",
    date: "30/03/2026",
    accountClass: "4201 Fee Income",
    accountName: "Disbursement Fee Income",
    voucherNumber: "CUST-28/03/26/18/04/52",
    particulars: "Management Fee",
    beginningBalance: 0.00,
    debit: 0.00,
    credit: 110.00,
    movement: 110.00,
    endingBalance: 110.00
  },
  {
    id: "tx_5",
    date: "31/03/2026",
    accountClass: "3001 Capital",
    accountName: "Owner's Equity",
    voucherNumber: "JV-20260331-001",
    particulars: "Capital Injection from Bank",
    beginningBalance: 0.00,
    debit: 0.00,
    credit: 10000000.00,
    movement: -10000000.00,
    endingBalance: -10000000.00
  },
  {
    id: "tx_6",
    date: "31/03/2026",
    accountClass: "1101 Assets",
    accountName: "Cash in Hand",
    voucherNumber: "JV-20260331-001",
    particulars: "Capital Injection Received",
    beginningBalance: 1500.00,
    debit: 10000000.00,
    credit: 0.00,
    movement: 10000000.00,
    endingBalance: 10001500.00
  }
];

// Raw Journal Entries (used for Recent Entries panel)
export const MOCK_RECENT_ENTRIES: JournalEntry[] = [
  {
    id: "je_1",
    date: "31/03/2026",
    voucherNumber: "JV-20260331-001",
    status: "posted",
    lines: [
      { id: "l1", accountId: "1101", accountName: "Cash in Hand", narration: "Capital Injection Received", debit: 10000000.00, credit: 0.00 },
      { id: "l2", accountId: "3001", accountName: "Owner's Equity", narration: "Capital Injection from Bank", debit: 0.00, credit: 10000000.00 }
    ]
  },
  {
    id: "je_2",
    date: "30/03/2026",
    voucherNumber: "CUST-28/03/26/18/04/52",
    status: "posted",
    lines: [
      { id: "l3", accountId: "1101", accountName: "Cash in Hand", narration: "Loan Payment Received", debit: 1500.00, credit: 0.00 },
      { id: "l4", accountId: "1201", accountName: "Loans to Customers", narration: "Principal Repayment", debit: 0.00, credit: 1290.00 },
      { id: "l5", accountId: "4101", accountName: "Interest on Loans", narration: "Interest Income", debit: 0.00, credit: 100.00 },
      { id: "l6", accountId: "4201", accountName: "Disbursement Fee Income", narration: "Management Fee", debit: 0.00, credit: 110.00 }
    ]
  }
];
