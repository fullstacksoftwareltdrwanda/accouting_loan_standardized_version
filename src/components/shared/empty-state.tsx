"use client";

import React from "react";
import { Database, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No data found",
  description = "No results were found for your current search or filters.",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mb-6 shadow-inner">
        {icon || (
          <Database className="h-10 w-10 text-zinc-200 dark:text-zinc-700" />
        )}
      </div>
      <h3 className="text-xl font-black tracking-tight text-[#1a365d] dark:text-blue-400 leading-tight uppercase">
        {title}
      </h3>
      <p className="mt-3 text-[13px] text-zinc-500 dark:text-zinc-400 max-w-[280px] mx-auto font-medium leading-relaxed italic">
        {description}
      </p>
      {action && (
        <div className="mt-8 transition-all hover:scale-105 active:scale-95">
          {action}
        </div>
      )}
    </div>
  );
}
