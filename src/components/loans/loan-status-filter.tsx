"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatusFilterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: Record<string, number>;
}

export function LoanStatusFilter({ activeTab, onTabChange, counts }: StatusFilterProps) {
  const tabs = [
    { label: "All", value: "all", count: counts.all || 0 },
    { label: "Active", value: "active", count: counts.active || 0 },
    { label: "Overdue", value: "overdue", count: counts.overdue || 0 },
    { label: "Suspended", value: "suspended", count: counts.suspended || 0 },
    { label: "Closed", value: "closed", count: counts.closed || 0 },
    { label: "Paid", value: "paid", count: counts.paid || 0 },
    { label: "Unpaid", value: "unpaid", count: counts.unpaid || 0 },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[var(--bg-sunken)] border border-[var(--border-subtle)] w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all duration-200",
            activeTab === tab.value 
              ? "bg-white text-[var(--text-primary)] shadow-sm" 
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          )}
        >
          {tab.label}
          <span className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-semibold",
            activeTab === tab.value 
              ? "bg-[var(--accent-primary)] text-white" 
              : "bg-[var(--bg-sunken)] text-[var(--text-tertiary)]"
          )}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
