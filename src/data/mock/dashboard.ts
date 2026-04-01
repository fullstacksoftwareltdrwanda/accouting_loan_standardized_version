import { DashboardStats } from "@/types/dashboard";

export const MOCK_DASHBOARD_DATA: DashboardStats = {
  // Stats Row 1
  totalDistributed: 4285000,
  activePrincipal: 3120400,
  activeInterest: 112500,
  portfolioValue: 3232900,
  totalOverdue: 82400,
  
  // Stats Row 2
  activeCustomers: 1284,
  totalAssets: 5400000,
  totalRevenue: 245000,
  
  // Summary Row 3
  todayPayments: 12400,
  expenses: 4200,
  pendingApplications: 24,
  equity: 1250000,
  
  // Table Data
  recentLoans: [
    {
      id: "1",
      loanNumber: "L-10294",
      customerName: "John Smith",
      amount: 15000,
      date: "2026-04-01",
      status: "Active",
    },
    {
      id: "2",
      loanNumber: "L-10295",
      customerName: "Sarah Johnson",
      amount: 45000,
      date: "2026-03-30",
      status: "Pending",
    },
    {
      id: "3",
      loanNumber: "L-10296",
      customerName: "David Lee",
      amount: 2500,
      date: "2026-03-28",
      status: "Overdue",
    },
    {
      id: "4",
      loanNumber: "L-10297",
      customerName: "Emma Brown",
      amount: 7200,
      date: "2026-03-25",
      status: "Settled",
    },
    {
      id: "5",
      loanNumber: "L-10298",
      customerName: "Michael Wang",
      amount: 12000,
      date: "2026-03-22",
      status: "Active",
    },
    {
      id: "6",
      loanNumber: "L-10299",
      customerName: "Maria Garcia",
      amount: 8500,
      date: "2026-03-20",
      status: "Rejected",
    },
  ],
};
