import { StatusType } from "./common";

export type AccountCategory = 
  | "Asset" 
  | "Liability" 
  | "Equity" 
  | "Revenue" 
  | "Expense"
  | "Balance Sheet"
  | "Income Statement";

export type NormalBalance = "Debit" | "Credit";

export interface GLAccount {
  id: string;
  code: string;
  name: string;
  category: AccountCategory; // Maps to 'Class' in the UI
  accountType: string;       // Secondary classification (e.g. 'Cash', 'Bank Account')
  subType: string;           // Tertiary classification (e.g. 'Current Asset')
  normalBalance: NormalBalance;
  description?: string;
  balance: number;
  isActive: boolean;
  status: StatusType;
  lastModified: string;
}
