"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export const BreadcrumbBar = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((p) => p !== "");

  return (
    <nav className="flex items-center space-x-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
      <Link 
        href="/dashboard" 
        className="hover:text-indigo-600 transition-colors flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

        // Don't show 'dashboard' again if it's the first element after home
        if (path.toLowerCase() === "dashboard" && index === 0) return null;

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
            {isLast ? (
              <span className="text-zinc-900 dark:text-zinc-100 font-semibold truncate max-w-[150px] md:max-w-none">
                {label}
              </span>
            ) : (
              <Link 
                href={href} 
                className="hover:text-indigo-600 transition-colors truncate max-w-[100px] md:max-w-none"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
