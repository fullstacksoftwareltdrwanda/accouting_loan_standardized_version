import { Notification } from "@/types/notification";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "not_1",
    type: "critical",
    title: "Overdue Payment Alert",
    description: "David Mugisha has missed the repayment for LN-2026-003.",
    date: "2026-04-01T09:30:00Z",
    isRead: false,
    link: "/loans/overdue"
  },
  {
    id: "not_2",
    type: "warning",
    title: "Pending Approval",
    description: "New Loan application (LN-2026-007) requires your review.",
    date: "2026-04-01T10:15:00Z",
    isRead: false,
    link: "/approvals"
  },
  {
    id: "not_3",
    type: "success",
    title: "Onboarding Successful",
    description: "Sarah Johnson has been successfully added to the borrower list.",
    date: "2026-03-31T14:20:00Z",
    isRead: true,
    link: "/customers"
  },
  {
    id: "not_4",
    type: "info",
    title: "System Update",
    description: "Chart of Accounts structure was modified by IT Admin.",
    date: "2026-03-30T16:45:00Z",
    isRead: false,
    link: "/accounts"
  },
  {
    id: "not_5",
    type: "warning",
    title: "High Expense Logged",
    description: "An operational cost of $125,000 (Salaries) is awaiting approval.",
    date: "2026-03-31T08:10:00Z",
    isRead: false,
    link: "/approvals"
  },
  {
    id: "not_6",
    type: "critical",
    title: "Asset Disposal Risk",
    description: "Asset #SN-APL-2024-001 has reached 80% depreciation.",
    date: "2026-04-01T11:00:00Z",
    isRead: false,
    link: "/assets"
  }
];
