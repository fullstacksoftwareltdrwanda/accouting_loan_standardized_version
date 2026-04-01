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
      "bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm",
      className
    )}>
      <div className="px-4 py-3.5 border-b border-zinc-100 flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-800">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-zinc-400">
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
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
