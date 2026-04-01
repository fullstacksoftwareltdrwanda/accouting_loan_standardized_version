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
    <div className="space-y-5 max-w-[1440px]">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <h2 className="text-xl font-bold tracking-tight text-zinc-800">
          Dashboard Overview
        </h2>
        <p className="text-[12px] text-zinc-400">
          Welcome back to ALMS. Here&apos;s your portfolio snapshot for today.
        </p>
      </div>

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard title="Total Distributed" value={data.totalDistributed} icon={Layout} color="indigo" />
        <StatCard title="Active Principal" value={data.activePrincipal} icon={CreditCard} color="blue" />
        <StatCard title="Active Interest" value={data.activeInterest} icon={Activity} color="emerald" />
        <StatCard title="Portfolio Value" value={data.portfolioValue} icon={Wallet} color="violet" />
        <StatCard title="Total Overdue" value={data.totalOverdue} icon={AlertCircle} color="red" />
      </div>

      {/* Row 2: Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard title="Active Customers" value={data.activeCustomers} icon={Users} color="blue" isCurrency={false} />
        <StatCard title="Total Assets" value={data.totalAssets} icon={Wallet} color="emerald" />
        <StatCard title="Total Revenue" value={data.totalRevenue} icon={Activity} color="violet" />
      </div>

      {/* Row 3: Table and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Loans (2/3 width) */}
        <div className="lg:col-span-2">
           <SectionCard 
             title="Recent Loan Applications" 
             subtitle="Review the latest loan requests and their current status."
             action={
               <button className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors">
                 View All <ArrowRight className="w-3 h-3" />
               </button>
             }
           >
             <RecentLoansTable loans={data.recentLoans} />
           </SectionCard>
        </div>

        {/* Financial Summary (1/3 width) */}
        <div className="space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Financial Summary</h3>
            <div className="grid grid-cols-1 gap-2.5">
                <StatCard title="Today's Payments" value={data.todayPayments} icon={CreditCard} color="emerald" />
                <StatCard title="Expenses" value={data.expenses} icon={FileText} color="amber" />
                <StatCard title="Pending Apps" value={data.pendingApplications} icon={PieChart} color="indigo" isCurrency={false} />
                <StatCard title="Equity" value={data.equity} icon={Layout} color="violet" />
            </div>
        </div>
      </div>
    </div>
  );
};
