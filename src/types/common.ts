import { LucideIcon } from "lucide-react";

export type StatusType = 
  | "active" 
  | "pending" 
  | "approved" 
  | "rejected" 
  | "overdue" 
  | "closed" 
  | "inactive"
  | "settled"
  | "suspended"
  | "paid"
  | "unpaid";

export interface DataTableAction<TData> {
  label: string;
  icon?: LucideIcon;
  onClick: (data: TData) => void;
  variant?: "default" | "danger" | "warning";
  disabled?: boolean | ((data: TData) => boolean);
}

export interface PaginatedResponse<TData> {
  items: TData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
