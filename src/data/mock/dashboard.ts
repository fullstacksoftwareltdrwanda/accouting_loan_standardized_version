import { DashboardStats } from "@/types/dashboard";

/**
 * PRODUCTION RESET: Cleared all hardcoded dashboard metrics.
 * The system now defaults to 0.00 for all financial KPIs.
 */
export const MOCK_DASHBOARD_DATA: DashboardStats = {
  // Stats Row 1
  totalDistributed: 0,
  activePrincipal: 0,
  activeInterest: 0,
  portfolioValue: 0,
  totalOverdue: 0,
  
  // Stats Row 2
  activeCustomers: 0,
  totalAssets: 0,
  totalRevenue: 0,
  
  // Summary Row 3
  todayPayments: 0,
  expenses: 0,
  pendingApplications: 0,
  equity: 0,
  
  // Table Data
  recentLoans: [],
};
