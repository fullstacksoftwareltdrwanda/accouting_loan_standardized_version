"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationConfig } from "@/config/navigation";
import { Logo } from "@/components/common/logo";

export const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 flex flex-col bg-[#020817] text-zinc-400 border-r border-zinc-800/50 shadow-2xl">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center px-8 border-b border-zinc-800/40">
        <Logo variant="light" isLink={true} iconSize={24} textSize="text-xl" />
      </div>

      {/* Navigation Areas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800">
        {navigationConfig.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="px-4 text-[10px] items-center font-extrabold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-500">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none",
                      isActive
                        ? "bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/30"
                        : "hover:bg-white/5 hover:text-zinc-200"
                    )}
                  >
                    <item.icon className={cn(
                        "w-5 h-5 transition-transform group-hover:scale-110",
                        isActive ? "text-indigo-500" : "text-zinc-500 group-hover:text-zinc-300"
                    )} />
                    <span className="flex-1 truncate">{item.title}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-zinc-800/40 bg-black/20">
        <div className="flex flex-col gap-2">
            {/* System Status Link */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-950/20 border border-indigo-500/10 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex-1">System Operational</span>
                <PieChart className="w-3.5 h-3.5 text-zinc-700" />
            </div>

            <button
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
                onClick={() => {
                   // Logout logic here later
                }}
            >
                <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>Terminate Session</span>
            </button>
        </div>
      </div>
    </aside>
  );
};
