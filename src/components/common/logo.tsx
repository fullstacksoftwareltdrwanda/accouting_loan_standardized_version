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
  variant?: "default" | "light"; // default is Dark background style, light is Light background style
}

export const Logo: React.FC<LogoProps> = ({
  className,
  iconSize = 24,
  textSize = "text-xl",
  isLink = true,
  variant = "default",
}) => {
  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <div 
        className={cn(
          "rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform hover:scale-105",
          iconSize <= 24 ? "w-10 h-10" : "w-12 h-12"
        )}
      >
        <BarChart className="text-white" size={iconSize} />
      </div>
      <span className={cn(
        "font-bold tracking-tight uppercase",
        textSize,
        variant === "default" ? "text-zinc-900 dark:text-zinc-50" : "text-white"
      )}>
        ALMS<span className="text-indigo-600">.</span>
      </span>
    </div>
  );

  if (isLink) {
    return (
      <Link href="/" className="inline-block no-underline">
        {content}
      </Link>
    );
  }

  return content;
};
