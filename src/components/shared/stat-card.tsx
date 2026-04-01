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
    blue: "text-blue-600 bg-blue-50",
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    red: "text-red-600 bg-red-50",
    violet: "text-violet-600 bg-violet-50",
  };

  return (
    <div className={cn(
      "group p-4 rounded-xl bg-white border border-zinc-100 shadow-sm transition-all hover:shadow-md",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "p-2 rounded-lg transition-transform group-hover:scale-105",
          colorMap[color]
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          {title}
        </p>
        <p className="text-lg font-bold text-zinc-800">
          {isCurrency ? formatCurrency(value) : value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
