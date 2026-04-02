"use client";

import React from "react";
import { 
  HandCoins, 
  TrendingUp, 
  BarChart3, 
  ShieldAlert, 
  Wallet, 
  ArrowUpRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, description, icon, color }: StatCardProps) => (
  <div className="flex flex-col p-5 rounded-3xl border border-zinc-200 bg-white shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800 transition-all hover:shadow-md group">
    <div className="flex items-start justify-between mb-4">
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm border transition-colors",
        color
      )}>
        {icon}
      </div>
      <div className="p-1 rounded-full bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-100 transition-colors">
        <ArrowUpRight className="h-3 w-3 text-zinc-400" />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{title}</p>
      <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
        {value}
      </h3>
      <p className="text-[11px] text-zinc-500 font-medium italic">{description}</p>
    </div>
  </div>
);

interface LoanStatsProps {
  loans: any[];
}

export function LoanStats({ loans }: LoanStatsProps) {
  // Simple calculation logic for mock totals
  const totalDistributed = loans.reduce((acc, l) => acc + l.principal, 0);
  const activePrincipal = loans.filter(l => l.status === "active").reduce((acc, l) => acc + l.principal, 0);
  const totalPayable = loans.reduce((acc, l) => acc + l.totalPayable, 0);
  const totalInterest = totalPayable - totalDistributed;
  const portfolioValue = loans.reduce((acc, l) => acc + (l.totalPayable - l.totalPaid), 0);
  const totalOverdue = loans.filter(l => l.status === "overdue").reduce((acc, l) => acc + (l.totalPayable - l.totalPaid), 0);
  const totalRevenue = loans.reduce((acc, l) => acc + l.totalPaid, 0); // Repayments

  const stats = [
    {
      title: "Total Distributed",
      value: `FRW ${totalDistributed.toLocaleString()}`,
      description: "Global disbursement",
      icon: <HandCoins className="h-5 w-5" />,
      color: "bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
    },
    {
      title: "Active Principal",
      value: `FRW ${activePrincipal.toLocaleString()}`,
      description: "Outstanding principal",
      icon: <HandCoins className="h-5 w-5" />,
      color: "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
    },
    {
      title: "Active Interest",
      value: `FRW ${totalInterest.toLocaleString()}`,
      description: "Expected interest",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-cyan-50 border-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-400"
    },
    {
      title: "Portfolio Value (P+I)",
      value: `FRW ${portfolioValue.toLocaleString()}`,
      description: "Total remaining balance",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
    },
    {
      title: "Total Overdue",
      value: `FRW ${totalOverdue.toLocaleString()}`,
      description: "Due & unpaid instalments",
      icon: <ShieldAlert className="h-5 w-5" />,
      color: "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400"
    },
    {
      title: "Total Revenue",
      value: `FRW ${totalRevenue.toLocaleString()}`,
      description: "Interest + Fees + Penalties",
      icon: <Wallet className="h-5 w-5" />,
      color: "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
