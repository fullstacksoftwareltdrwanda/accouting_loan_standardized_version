"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { StatusType } from "@/types/common";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:focus:ring-zinc-300",
  {
    variants: {
      variant: {
        active: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
        approved: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
        rejected: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400",
        overdue: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
        closed: "border-zinc-200 bg-zinc-100 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100",
        inactive: "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-500",
        settled: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "pending",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status: StatusType;
}

export function StatusBadge({
  status,
  className,
  variant,
  ...props
}: StatusBadgeProps) {
  // Map standard status titles to variants if needed (case-insensitive)
  const normalizedStatus = status.toLowerCase() as StatusType;

  return (
    <div
      className={cn(badgeVariants({ variant: normalizedStatus || variant }), className)}
      {...props}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
