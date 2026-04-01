"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: "blue" | "indigo" | "emerald" | "amber" | "red" | "violet";
  isCurrency?: boolean;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "indigo",
  isCurrency = true,
  className,
}: StatCardProps) => {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400",
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 dark:text-indigo-400",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400",
    red: "text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400",
    violet: "text-violet-600 bg-violet-50 dark:bg-violet-900/10 dark:text-violet-400",
  };

  return (
    <div className={cn(
      "group p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900/50 dark:border-zinc-800",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "p-3 rounded-xl transition-transform group-hover:scale-110",
          colorMap[color]
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {title}
        </p>
        <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
          {isCurrency ? formatCurrency(value) : value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
