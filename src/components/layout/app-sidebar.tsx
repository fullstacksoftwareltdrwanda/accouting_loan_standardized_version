"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationConfig } from "@/config/navigation";
import { Logo } from "@/components/common/logo";

export const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[250px] flex flex-col bg-[#0f1629] text-zinc-400">
      {/* Sidebar Header */}
      <div className="flex h-14 items-center px-5 border-b border-white/5">
        <Logo variant="light" isLink={true} iconSize={20} textSize="text-base" />
      </div>

      {/* Auth Status Card */}
      <div className="px-4 py-6">
        <div className="rounded-xl bg-blue-600/10 border border-blue-500/20 p-4 text-center space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <PieChart className="w-12 h-12 text-blue-400" />
          </div>
          
          <div className="mx-auto w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <div className="w-5 h-5 text-white">⚡</div>
          </div>
          
          <div className="space-y-1 relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Authenticated: Company Director</p>
            <p className="text-[13px] font-black text-white">Director</p>
          </div>
          
          <div className="pt-2 border-t border-white/5 space-y-2 relative z-10">
            <p className="text-[11px] font-medium text-zinc-400 leading-tight">realtime liquidity management.</p>
            <div className="flex items-center justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Ecosystem Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Areas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800">
        {navigationConfig.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500/70">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 outline-none",
                      isActive
                        ? "bg-indigo-500/15 text-indigo-300"
                        : "hover:bg-white/5 hover:text-zinc-200"
                    )}
                  >
                    <item.icon className={cn(
                        "w-4 h-4 transition-transform",
                        isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
                    )} />
                    <span className="flex-1 truncate">{item.title}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-500/50" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/5">
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex-1">System Online</span>
                <PieChart className="w-3 h-3 text-zinc-600" />
            </div>

            <button
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-300 transition-all group"
                onClick={() => {
                   window.location.href = "/login";
                }}
            >
                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Terminate Session</span>
            </button>
        </div>
      </div>
    </aside>
  );
};
