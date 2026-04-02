"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn(
      "space-y-6 p-6 md:p-8 rounded-2xl bg-white border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-sm)]",
      className
    )}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-[13px] text-[var(--text-tertiary)]">
            {description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
        {children}
      </div>
    </div>
  );
}
