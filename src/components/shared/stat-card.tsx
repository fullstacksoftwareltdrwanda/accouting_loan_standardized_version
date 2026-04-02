"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: "teal" | "indigo" | "emerald" | "amber" | "rose" | "blue" | "violet" | "red";
  isCurrency?: boolean;
  className?: string;
}

const colorMap: Record<string, { icon: string; accent: string }> = {
  teal:    { icon: "text-teal-600",    accent: "text-teal-600" },
  indigo:  { icon: "text-indigo-500",  accent: "text-indigo-600" },
  emerald: { icon: "text-emerald-600", accent: "text-emerald-600" },
  amber:   { icon: "text-amber-600",   accent: "text-amber-600" },
  rose:    { icon: "text-rose-500",    accent: "text-rose-600" },
  blue:    { icon: "text-blue-600",    accent: "text-blue-600" },
  violet:  { icon: "text-violet-600",  accent: "text-violet-600" },
  red:     { icon: "text-rose-500",    accent: "text-rose-600" },
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "teal",
  isCurrency = true,
  className,
}: StatCardProps) => {
  const colors = colorMap[color] || colorMap.teal;

  return (
    <div className={cn(
      "group p-5 rounded-2xl bg-white border border-[var(--border-subtle)] transition-all duration-300",
      "hover:shadow-md hover:-translate-y-0.5",
      className
    )}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={cn("w-5 h-5", colors.icon)} />
        <p className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
          {title}
        </p>
      </div>
      <p className={cn("text-2xl font-bold tracking-tight", colors.accent)}>
        {isCurrency ? formatCurrency(value) : value.toLocaleString()}
      </p>
    </div>
  );
};
