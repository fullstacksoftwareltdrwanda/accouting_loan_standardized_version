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
    Active: "bg-blue-50 text-blue-700",
    Pending: "bg-amber-50 text-amber-700",
    Rejected: "bg-rose-50 text-rose-600",
    Settled: "bg-emerald-50 text-emerald-700",
    Overdue: "bg-rose-50 text-rose-600",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold",
      styles[status] || styles.Pending
    )}>
      {status}
    </span>
  );
};

export const RecentLoansTable = ({ loans }: RecentLoansTableProps) => {
  if (loans.length === 0) {
    return (
      <div className="py-12 text-center text-[13px] text-[var(--text-tertiary)]">
        No recent loan applications
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[var(--border-subtle)]">
            <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">Loan #</th>
            <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">Customer</th>
            <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">Amount</th>
            <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">Date</th>
            <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors duration-150">
              <td className="px-6 py-4 text-[13px] font-semibold text-[var(--text-primary)] font-mono">
                {loan.loanNumber}
              </td>
              <td className="px-6 py-4 text-[13px] text-[var(--text-secondary)]">
                {loan.customerName}
              </td>
              <td className="px-6 py-4 text-[13px] font-semibold text-[var(--text-primary)]">
                {formatCurrency(loan.amount)}
              </td>
              <td className="px-6 py-4 text-[13px] text-[var(--text-tertiary)]">
                {format(new Date(loan.date), "MMM dd, yyyy")}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={loan.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
