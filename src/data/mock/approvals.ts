import { ApprovalRequest } from "@/types/approval";

export const MOCK_APPROVALS: ApprovalRequest[] = [
  {
    id: "app_1",
    type: "Loan",
    title: "Personal Loan Application - John Smith",
    requester: "Admin User",
    amount: 5000.00,
    date: "2026-03-30",
    status: "pending",
    description: "New application for Home Improvement."
  },
  {
    id: "app_2",
    type: "Expense",
    title: "Office Rent - March 2026",
    requester: "Accountant Hub",
    amount: 45000.00,
    date: "2026-03-31",
    status: "pending",
    description: "Monthly recurring expenditure."
  },
  {
    id: "app_3",
    type: "Loan",
    title: "Business Expansion - Sarah Johnson",
    requester: "Loan Officer A",
    amount: 12000.00,
    date: "2026-03-28",
    status: "pending",
  },
  {
    id: "app_4",
    type: "Expense",
    title: "Staff Salaries",
    requester: "HR Manager",
    amount: 125000.00,
    date: "2026-03-31",
    status: "active", // Approved
  },
  {
    id: "app_5",
    type: "Account",
    title: "New Asset Account: 1401 - IT Equipment",
    requester: "IT Admin",
    date: "2026-03-25",
    status: "pending",
    description: "Expansion of fixed asset ledger."
  },
  {
    id: "app_6",
    type: "Adjustment",
    title: "Interest Balancing - Q1 2026",
    requester: "Lead Accountant",
    amount: 1250.00,
    date: "2026-03-29",
    status: "pending",
  }
];
