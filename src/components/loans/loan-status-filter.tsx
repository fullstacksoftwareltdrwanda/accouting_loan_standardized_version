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
    { label: "All Status", value: "all", count: counts.all || 0, color: "bg-blue-600" },
    { label: "Active", value: "active", count: counts.active || 0, color: "bg-emerald-500" },
    { label: "Overdue", value: "overdue", count: counts.overdue || 0, color: "bg-rose-500" },
    { label: "Suspended", value: "suspended", count: counts.suspended || 0, color: "bg-amber-500" },
    { label: "Closed", value: "closed", count: counts.closed || 0, color: "bg-zinc-500" },
    { label: "Paid (Instalments)", value: "paid", count: counts.paid || 0, color: "bg-cyan-500" },
    { label: "Unpaid (Instalments)", value: "unpaid", count: counts.unpaid || 0, color: "bg-zinc-400" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
            activeTab === tab.value 
              ? "bg-white text-zinc-900 shadow-md transform -translate-y-[1px] dark:bg-zinc-800 dark:text-zinc-50" 
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          )}
        >
          {tab.label}
          <span className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] font-black",
            activeTab === tab.value ? tab.color : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
          )}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
