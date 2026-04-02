import { StatusType } from "./common";

export type LoanCategory = "Personal" | "Business" | "Emergency" | "Education";
export type RepaymentFrequency = "Daily" | "Weekly" | "Monthly";

export interface Loan {
  id: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  principal: number;
  interestRate: number; // e.g., 15 for 15%
  term: number; // in months/weeks
  frequency: RepaymentFrequency;
  category: LoanCategory;
  startDate: string;
  disbursementDate: string;
  maturityDate: string;
  totalPayable: number;
  totalPaid: number;
  collateralValue?: number;
  daysOverdue?: number;
  status: StatusType;
  purpose?: string;
  lastPaymentDate?: string;
  nextPaymentDate: string;
}
