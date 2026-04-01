"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function LoadingSkeleton({
  rows = 5,
  columns = 4,
  className,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("w-full space-y-4 animate-pulse p-4", className)}>
      <div className="flex space-x-4 mb-4 items-center">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 h-4 bg-zinc-100 dark:bg-zinc-800 rounded shadow-sm"></div>
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex space-x-4 items-center">
            {Array.from({ length: columns }).map((_, j) => (
              <div
                key={j}
                className={cn(
                  "flex-1 h-10 bg-zinc-50 dark:bg-zinc-900 rounded-xl",
                  j === 0 ? "scale-95" : ""
                )}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
