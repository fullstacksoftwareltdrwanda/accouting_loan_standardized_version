"use client";

import React from "react";
import { 
  Users, 
  CreditCard, 
  Activity, 
  AlertCircle, 
  Wallet, 
  Layout, 
  FileText, 
  PieChart,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { DashboardStats } from "@/types/dashboard";
import { StatCard } from "@/components/shared/stat-card";
import { SectionCard } from "@/components/shared/section-card";
import { RecentLoansTable } from "./recent-loans-table";

interface DashboardOverviewProps {
  data: DashboardStats;
}

export const DashboardOverview = ({ data }: DashboardOverviewProps) => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-[13px] text-[var(--text-tertiary)] font-medium">Welcome back</p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Dashboard Overview
          </h1>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[var(--text-tertiary)]">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Live data</span>
        </div>
      </div>

      {/* Key Metrics — staggered animation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 stagger-children">
        <StatCard title="Total Distributed" value={data.totalDistributed} icon={Layout} color="teal" />
        <StatCard title="Active Principal" value={data.activePrincipal} icon={CreditCard} color="blue" />
        <StatCard title="Active Interest" value={data.activeInterest} icon={Activity} color="emerald" />
        <StatCard title="Portfolio Value" value={data.portfolioValue} icon={Wallet} color="indigo" />
        <StatCard title="Total Overdue" value={data.totalOverdue} icon={AlertCircle} color="rose" />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        <StatCard title="Active Customers" value={data.activeCustomers} icon={Users} color="blue" isCurrency={false} />
        <StatCard title="Total Assets" value={data.totalAssets} icon={Wallet} color="emerald" />
        <StatCard title="Total Revenue" value={data.totalRevenue} icon={TrendingUp} color="teal" />
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Loans — 2/3 width */}
        <div className="lg:col-span-2">
          <SectionCard 
            title="Recent Loan Applications" 
            subtitle="Latest loan requests and their current status"
            noPadding
            action={
              <button className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <RecentLoansTable loans={data.recentLoans} />
          </SectionCard>
        </div>

        {/* Financial Summary — 1/3 width */}
        <div className="space-y-4">
          <h3 className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider px-1">Financial Summary</h3>
          <div className="grid grid-cols-1 gap-3 stagger-children">
            <StatCard title="Today's Payments" value={data.todayPayments} icon={CreditCard} color="emerald" />
            <StatCard title="Expenses" value={data.expenses} icon={FileText} color="amber" />
            <StatCard title="Pending Apps" value={data.pendingApplications} icon={PieChart} color="indigo" isCurrency={false} />
            <StatCard title="Equity" value={data.equity} icon={Layout} color="teal" />
          </div>
        </div>
      </div>
    </div>
  );
};
