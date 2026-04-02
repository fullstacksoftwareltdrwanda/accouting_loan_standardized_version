"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const SectionCard = ({
  title,
  subtitle,
  children,
  action,
  className,
  noPadding = false,
}: SectionCardProps) => {
  return (
    <div className={cn(
      "bg-white border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-sm)]",
      className
    )}>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)] tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[12px] text-[var(--text-tertiary)]">
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
      <div className={noPadding ? "" : "px-6 pb-6"}>
        {children}
      </div>
    </div>
  );
};
