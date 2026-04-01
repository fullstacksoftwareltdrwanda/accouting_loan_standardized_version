"use client";

import React from "react";
import { format } from "date-fns";
import { RecentLoan, LoanStatus } from "@/types/dashboard";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface RecentLoansTableProps {
  loans: RecentLoan[];
}

const StatusBadge = ({ status }: { status: LoanStatus }) => {
  const styles: Record<LoanStatus, string> = {
    Active: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    Pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    Rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    Settled: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    Overdue: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-bold border",
      styles[status] || styles.Pending
    )}>
      {status}
    </span>
  );
};

export const RecentLoansTable = ({ loans }: RecentLoansTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-800">
            <th className="pb-4 pt-0 text-xs font-extrabold uppercase tracking-widest text-zinc-400">Loan #</th>
            <th className="pb-4 pt-0 text-xs font-extrabold uppercase tracking-widest text-zinc-400">Customer</th>
            <th className="pb-4 pt-0 text-xs font-extrabold uppercase tracking-widest text-zinc-400">Amount</th>
            <th className="pb-4 pt-0 text-xs font-extrabold uppercase tracking-widest text-zinc-400">Date</th>
            <th className="pb-4 pt-0 text-xs font-extrabold uppercase tracking-widest text-zinc-400">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
          {loans.map((loan) => (
            <tr key={loan.id} className="group hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors">
              <td className="py-4 text-sm font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                {loan.loanNumber}
              </td>
              <td className="py-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {loan.customerName}
              </td>
              <td className="py-4 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                {formatCurrency(loan.amount)}
              </td>
              <td className="py-4 text-sm text-zinc-500 font-sans">
                {format(new Date(loan.date), "MMM dd, yyyy")}
              </td>
              <td className="py-4">
                <StatusBadge status={loan.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
