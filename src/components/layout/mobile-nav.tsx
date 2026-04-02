"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { topNavItems, sidebarNavigationConfig } from "@/config/navigation";

export const MobileNav = () => {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ═══════════════════════════════════════════
          MOBILE BOTTOM TAB BAR — Primary modules
          Shows the 5 main module icons at the bottom
      ═══════════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[var(--border-subtle)] safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {topNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                  isActive
                    ? "text-teal-600"
                    : "text-[var(--text-tertiary)]"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-[10px] font-medium leading-none",
                  isActive ? "font-semibold" : ""
                )}>
                  {item.title === "General Ledger" ? "Ledger" : item.title}
                </span>
                {isActive && (
                  <div className="absolute top-0 w-8 h-0.5 rounded-full bg-teal-500" />
                )}
              </Link>
            );
          })}
          
          {/* More button to open sidebar drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
              drawerOpen ? "text-teal-600" : "text-[var(--text-tertiary)]"
            )}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          MOBILE DRAWER — Secondary/sidebar items
          Slides in from right when "More" is tapped
      ═══════════════════════════════════════════ */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border-subtle)]">
              <span className="font-bold text-[15px] text-[var(--text-primary)]">Navigation</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
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
                        onClick={() => setDrawerOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                          isActive
                            ? "bg-teal-50 text-teal-600"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        <item.icon className={cn(
                          "w-[18px] h-[18px]",
                          isActive && "scale-110"
                        )} />
                        <span>{item.title}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />
                        )}
                      </Link>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => { window.location.href = "/login"; }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-rose-50 hover:text-rose-500 transition-all"
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
