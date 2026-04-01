import { StatusType } from "./common";

export type ExpenseCategory = 
  | "Fixed Cost" 
  | "Variable Cost" 
  | "Administrative" 
  | "Financial" 
  | "Marketing" 
  | "Salaries";

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  accountCode: string; // Linked to GL Ledger (e.g. 5101)
  status: StatusType; // 'paid' or 'pending'
  reference?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: "Electronics" | "Furniture" | "Vehicles" | "Property";
  serialNumber?: string;
  purchaseDate: string;
  value: number; // Purchase Price
  depreciationRate: number; // Annual %
  currentValue: number;
  status: StatusType;
}
