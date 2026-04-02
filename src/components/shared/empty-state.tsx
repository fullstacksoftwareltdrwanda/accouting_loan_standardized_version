"use client";

import React from "react";
import { Database } from "lucide-react";
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
        "flex flex-col items-center justify-center py-16 px-8 text-center animate-float-in",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-sunken)] mb-5">
        {icon || (
          <Database className="h-7 w-7 text-[var(--text-disabled)]" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-[13px] text-[var(--text-tertiary)] max-w-[300px] mx-auto leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}
