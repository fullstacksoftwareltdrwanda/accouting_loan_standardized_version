import { StatusType } from "./common";

export interface CustomerFinancials {
  totalLoans: number;
  activeBalance: number;
  totalPaid: number;
  onTimeRepaymentRate: number;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nin: string; // National ID / Passport
  status: StatusType;
  address?: string;
  joinedDate: string;
  financials: CustomerFinancials;
}
