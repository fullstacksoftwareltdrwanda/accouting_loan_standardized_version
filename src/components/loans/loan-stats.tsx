"use client";

import React from "react";
import { 
  HandCoins, 
  TrendingUp, 
  BarChart3, 
  ShieldAlert, 
  Wallet, 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanStatProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const LoanStatCard = ({ title, value, description, icon, color }: LoanStatProps) => (
  <div className="flex flex-col p-5 rounded-2xl bg-white border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] transition-all duration-300 hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5 group">
    <div className="flex items-center gap-3 mb-3">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", color)}>
        {icon}
      </div>
      <p className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{title}</p>
    </div>
    <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
      {value}
    </h3>
    <p className="text-[11px] text-[var(--text-tertiary)] mt-1">{description}</p>
  </div>
);

interface LoanStatsProps {
  loans: any[];
}

export function LoanStats({ loans }: LoanStatsProps) {
  const totalDistributed = loans.reduce((acc, l) => acc + l.principal, 0);
  const activePrincipal = loans.filter(l => l.status === "active").reduce((acc, l) => acc + l.principal, 0);
  const totalPayable = loans.reduce((acc, l) => acc + l.totalPayable, 0);
  const totalInterest = totalPayable - totalDistributed;
  const portfolioValue = loans.reduce((acc, l) => acc + (l.totalPayable - l.totalPaid), 0);
  const totalOverdue = loans.filter(l => l.status === "overdue").reduce((acc, l) => acc + (l.totalPayable - l.totalPaid), 0);
  const totalRevenue = loans.reduce((acc, l) => acc + l.totalPaid, 0);

  const stats = [
    {
      title: "Total Distributed",
      value: `FRW ${totalDistributed.toLocaleString()}`,
      description: "Global disbursement",
      icon: <HandCoins className="h-4 w-4" />,
      color: "bg-teal-50 text-teal-600"
    },
    {
      title: "Active Principal",
      value: `FRW ${activePrincipal.toLocaleString()}`,
      description: "Outstanding principal",
      icon: <HandCoins className="h-4 w-4" />,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Active Interest",
      value: `FRW ${totalInterest.toLocaleString()}`,
      description: "Expected interest",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Portfolio Value",
      value: `FRW ${portfolioValue.toLocaleString()}`,
      description: "Total remaining balance",
      icon: <BarChart3 className="h-4 w-4" />,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Total Overdue",
      value: `FRW ${totalOverdue.toLocaleString()}`,
      description: "Due & unpaid instalments",
      icon: <ShieldAlert className="h-4 w-4" />,
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "Total Revenue",
      value: `FRW ${totalRevenue.toLocaleString()}`,
      description: "Interest + Fees + Penalties",
      icon: <Wallet className="h-4 w-4" />,
      color: "bg-amber-50 text-amber-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 stagger-children">
      {stats.map((stat, i) => (
        <LoanStatCard key={i} {...stat} />
      ))}
    </div>
  );
}
