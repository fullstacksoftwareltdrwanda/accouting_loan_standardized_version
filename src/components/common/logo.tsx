"use client";

import React from "react";
import Link from "next/link";
import { BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  isLink?: boolean;
  variant?: "default" | "light";
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
          "rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/15 transition-transform hover:scale-105",
          iconSize <= 20 ? "w-8 h-8" : "w-10 h-10"
        )}
      >
        <BarChart className="text-white" size={iconSize} />
      </div>
      <span className={cn(
        "font-bold tracking-tight uppercase",
        textSize,
        variant === "default" ? "text-zinc-800" : "text-white"
      )}>
        ALMS<span className="text-indigo-500">.</span>
      </span>
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
