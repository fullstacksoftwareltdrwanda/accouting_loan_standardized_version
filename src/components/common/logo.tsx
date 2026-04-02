"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  isLink?: boolean;
  variant?: "default" | "light" | "compact";
}

export const Logo: React.FC<LogoProps> = ({
  className,
  iconSize = 20,
  textSize = "text-base",
  isLink = true,
  variant = "default",
}) => {
  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div 
        className={cn(
          "rounded-[12px] bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md transition-transform hover:scale-105",
          iconSize <= 20 ? "w-8 h-8" : "w-10 h-10"
        )}
      >
        <span className="text-white font-bold" style={{ fontSize: iconSize * 0.65 }}>A</span>
      </div>
      {variant !== "compact" && (
        <span className={cn(
          "font-bold tracking-tight",
          textSize,
          variant === "default" ? "text-[var(--text-primary)]" : "text-white"
        )}>
          ALMS<span className="text-teal-500">.</span>
        </span>
      )}
    </div>
  );

  if (isLink) {
    return (
      <Link href="/dashboard" className="inline-block no-underline">
        {content}
      </Link>
    );
  }

  return content;
};
