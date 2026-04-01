import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <span>{Math.round(percentage)}% Paid</span>
          <span>{value}/{max}</span>
        </div>
      )}
    </div>
  );
}
