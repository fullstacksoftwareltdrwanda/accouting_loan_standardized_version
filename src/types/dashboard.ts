export type LoanStatus = "Active" | "Pending" | "Rejected" | "Settled" | "Overdue";

export interface RecentLoan {
  id: string;
  loanNumber: string;
  customerName: string;
  amount: number;
  date: string;
  status: LoanStatus;
}

export interface DashboardStats {
  // Top Row
  totalDistributed: number;
  activePrincipal: number;
  activeInterest: number;
  portfolioValue: number;
  totalOverdue: number;
  
  // Second Row
  activeCustomers: number;
  totalAssets: number;
  totalRevenue: number;
  
  // Third Row Summary
  todayPayments: number;
  expenses: number;
  pendingApplications: number;
  equity: number;
  
  // Table Data
  recentLoans: RecentLoan[];
}
