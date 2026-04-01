import { StatusType } from "./common";

export type AccountCategory = 
  | "Asset" 
  | "Liability" 
  | "Equity" 
  | "Revenue" 
  | "Expense";

export type NormalBalance = "Debit" | "Credit";

export interface GLAccount {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  normalBalance: NormalBalance;
  description?: string;
  balance: number;
  status: StatusType;
  lastModified: string;
}
