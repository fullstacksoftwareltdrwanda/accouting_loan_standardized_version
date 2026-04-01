import { LucideIcon } from "lucide-react";

export type ReportCategory = "Financial" | "Operational" | "Compliance";
export type ReportStatus = "ready" | "generating" | "failed";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  lastGenerated?: string;
  status: ReportStatus;
  format: "PDF" | "CSV" | "EXCEL";
  size?: string;
}
