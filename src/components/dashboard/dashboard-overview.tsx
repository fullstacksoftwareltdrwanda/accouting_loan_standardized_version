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
  TrendingDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { DashboardStats } from "@/types/dashboard";
import { StatCard } from "@/components/shared/stat-card";
import { SectionCard } from "@/components/shared/section-card";
import { RecentLoansTable } from "./recent-loans-table";
import { cn } from "@/lib/utils";

interface DashboardOverviewProps {
  data: DashboardStats;
}

export const DashboardOverview = ({ data }: DashboardOverviewProps) => {
  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
          Dashboard Overview
        </h2>
        <p className="text-zinc-500 font-sans dark:text-zinc-400">
          Welcome back to ALMS. Here's your portfolio snapshot for today.
        </p>
      </div>

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Distributed" value={data.totalDistributed} icon={Layout} color="indigo" />
        <StatCard title="Active Principal" value={data.activePrincipal} icon={CreditCard} color="blue" />
        <StatCard title="Active Interest" value={data.activeInterest} icon={Activity} color="emerald" />
        <StatCard title="Portfolio Value" value={data.portfolioValue} icon={Wallet} color="violet" />
        <StatCard title="Total Overdue" value={data.totalOverdue} icon={AlertCircle} color="red" />
      </div>

      {/* Row 2: Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Customers" value={data.activeCustomers} icon={Users} color="blue" isCurrency={false} />
        <StatCard title="Total Assets" value={data.totalAssets} icon={Wallet} color="emerald" />
        <StatCard title="Total Revenue" value={data.totalRevenue} icon={Activity} color="violet" />
      </div>

      {/* Row 3: Table and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Loans (2/3 width) */}
        <div className="lg:col-span-2">
           <SectionCard 
             title="Recent Loan Applications" 
             subtitle="Review the latest loan requests and their current status."
             action={
               <button className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">
                 View All <ArrowRight className="w-4 h-4" />
               </button>
             }
           >
             <RecentLoansTable loans={data.recentLoans} />
           </SectionCard>
        </div>

        {/* Financial Summary (1/3 width) */}
        <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Financial Summary</h3>
            <div className="grid grid-cols-1 gap-4">
                <StatCard title="Today's Payments" value={data.todayPayments} icon={CreditCard} color="emerald" className="p-5" />
                <StatCard title="Expenses" value={data.expenses} icon={FileText} color="amber" className="p-5" />
                <StatCard title="Pending Apps" value={data.pendingApplications} icon={PieChart} color="indigo" isCurrency={false} className="p-5" />
                <StatCard title="Equity" value={data.equity} icon={Layout} color="violet" className="p-5" />
            </div>
        </div>
      </div>
    </div>
  );
};
