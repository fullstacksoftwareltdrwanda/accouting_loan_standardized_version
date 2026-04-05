/**
 * Dashboard Service — real API implementation.
 * Replaces src/services/mock/dashboard.service.ts
 */
import { api } from "@/lib/api-client";
import { DashboardStats } from "@/types/dashboard";

export async function getDashboardStats(): Promise<DashboardStats> {
  const result = await api.get<{
    metrics: {
      totalPortfolio: number;
      totalOutstanding: number;
      totalCollected: number;
      overdueCount: number;
      activeCount: number;
      settledCount: number;
      pendingApprovalCount: number;
      todayCollected: number;
      todayPaymentCount: number;
    };
    recentLoans: any[];
    recentPayments: any[];
    overdueLoans: any[];
  }>("/api/reports/dashboard");

  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch dashboard data");

  const { metrics, recentLoans } = result.data!;

  // Map backend metrics to DashboardStats interface
  return {
    totalDistributed: metrics.totalPortfolio,
    activePrincipal: metrics.totalOutstanding,
    // We assume activeInterest is included in global outstanding for now or dummy if not split in current API
    activeInterest: 0, 
    portfolioValue: metrics.totalPortfolio,
    totalOverdue: metrics.overdueCount,
    
    activeCustomers: metrics.activeCount,
    // totalAssets and todayPayments mapping
    totalAssets: metrics.totalPortfolio, 
    totalRevenue: metrics.totalCollected,
    
    todayPayments: metrics.todayCollected,
    expenses: 0, // Not yet implemented in dashboard API
    pendingApplications: metrics.pendingApprovalCount,
    equity: metrics.totalPortfolio - metrics.totalOutstanding,
    
    recentLoans: recentLoans.map((l: any) => ({
      id: l.id,
      loanNumber: l.loanNumber,
      customerName: l.customerName,
      amount: l.loanAmount,
      date: l.createdAt,
      status: l.loanStatus as any,
    })),
  };
}

export async function getDashboardData() {
  return getDashboardStats();
}
