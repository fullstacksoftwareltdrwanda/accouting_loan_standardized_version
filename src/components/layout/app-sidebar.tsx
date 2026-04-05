"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNavigationConfig } from "@/config/navigation";
import { logoutAction } from "@/lib/auth-actions";
import { clearTokens } from "@/lib/api-client";

export const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-white border-r border-[var(--border-subtle)]">
      {/* Logo Mark */}
      <div className="flex h-16 items-center px-6 border-b border-[var(--border-subtle)]">
        <Link href="/dashboard" className="group flex flex-row items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
            <span className="text-white font-black text-sm tracking-tight">A</span>
          </div>
          <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight">ALMS.</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1 scrollbar-thin">
        {sidebarNavigationConfig.map((section, sIdx) => (
          <React.Fragment key={section.title}>
            {sIdx > 0 && (
              <div className="my-3 mx-2 h-px bg-[var(--border-subtle)]" />
            )}
            <div className="px-3 py-2 text-[10px] font-bold text-[var(--text-disabled)] uppercase tracking-[0.08em]">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium",
                    isActive
                      ? "bg-teal-50 text-teal-600 shadow-sm"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <item.icon className={cn(
                    "w-[18px] h-[18px] transition-transform duration-200",
                    isActive && "scale-110"
                  )} />
                  <span>{item.title}</span>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-500" />
                  )}
                </Link>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border-subtle)] space-y-1">
        {/* System status */}
        <div className="flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-[var(--text-tertiary)]">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-40" />
          </div>
          <span>System Operational</span>
        </div>
        
        {/* Logout */}
        <button
          onClick={async () => {
            await logoutAction();
            clearTokens();
            window.location.href = "/login";
          }}
          className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-rose-50 hover:text-rose-500 transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
