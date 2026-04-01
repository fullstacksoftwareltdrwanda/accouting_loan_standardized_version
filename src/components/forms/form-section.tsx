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
      "space-y-6 p-8 rounded-[32px] bg-white border border-zinc-200 shadow-sm transition-all hover:shadow-md dark:bg-zinc-950/40 dark:border-zinc-800",
      className
    )}>
      <div className="space-y-1">
        <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-zinc-500 font-sans italic dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {children}
      </div>
    </div>
  );
}
