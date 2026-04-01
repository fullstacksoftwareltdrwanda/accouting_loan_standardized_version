"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionCard = ({
  title,
  subtitle,
  children,
  action,
  className,
}: SectionCardProps) => {
  return (
    <div className={cn(
      "bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm transition-all hover:shadow-md dark:bg-zinc-900/50 dark:border-zinc-800",
      className
    )}>
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-zinc-500 font-sans dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
