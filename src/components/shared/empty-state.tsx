"use client";

import React from "react";
import { Database, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No data found",
  description = "No results were found for your current search or filters.",
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 mb-6">
        {icon || (
          <Database className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
        )}
      </div>
      <h3 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px] mx-auto font-sans leading-relaxed">
        {description}
      </p>
    </div>
  );
}
