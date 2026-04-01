import { StatusType } from "./common";

export type ApprovalType = "Loan" | "Expense" | "Account" | "Adjustment";

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  title: string;
  requester: string;
  amount?: number;
  date: string;
  status: StatusType;
  description?: string;
  metadata?: Record<string, any>;
}
