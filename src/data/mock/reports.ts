import { Report } from "@/types/report";

export const MOCK_REPORTS: Report[] = [
  {
    id: "rep_1",
    title: "Profit & Loss Statement",
    description: "Detailed breakdown of Loan Interest (Revenue) vs Operational Expenses.",
    category: "Financial",
    status: "ready",
    format: "PDF",
    lastGenerated: "2026-03-31T18:00:00Z",
    size: "245 KB"
  },
  {
    id: "rep_2",
    title: "Portfolio Health Report",
    description: "Aggregate performance of all active loans, including overdue percentages.",
    category: "Operational",
    status: "ready",
    format: "PDF",
    lastGenerated: "2026-04-01T08:00:00Z",
    size: "1.2 MB"
  },
  {
    id: "rep_3",
    title: "Expense Breakdown (Quarterly)",
    description: "Line-by-line export of all logged business expenditures.",
    category: "Financial",
    status: "ready",
    format: "EXCEL",
    lastGenerated: "2026-03-31T17:30:00Z",
    size: "890 KB"
  },
  {
    id: "rep_4",
    title: "Customer KYC Export",
    description: "Bulk list of borrower identities, contact info, and addresses.",
    category: "Compliance",
    status: "ready",
    format: "CSV",
    lastGenerated: "2026-03-25T14:00:00Z",
    size: "3.4 MB"
  },
  {
    id: "rep_5",
    title: "Asset Depreciation Log",
    description: "Current valuation vs Purchase Price for all fixed assets.",
    category: "Financial",
    status: "ready",
    format: "PDF",
    lastGenerated: "2026-03-28T10:15:00Z",
    size: "150 KB"
  },
  {
    id: "rep_6",
    title: "Suspicious Activity Report (SAR)",
    description: "Automated flagging of irregular operational or financial events.",
    category: "Compliance",
    status: "ready",
    format: "PDF"
  }
];
