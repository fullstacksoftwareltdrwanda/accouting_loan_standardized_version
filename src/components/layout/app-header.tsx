"use client";

import React from "react";
import Link from "next/link";
import { User, Search, Settings } from "lucide-react";
import { BreadcrumbBar } from "./breadcrumb-bar";
import { NotificationsDropdown } from "../shared/notifications-dropdown";

export const AppHeader = () => {
  return (
    <header className="sticky top-0 z-30 flex h-12 w-full items-center justify-between border-b border-zinc-200/60 bg-white/95 px-6 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <BreadcrumbBar />
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden relative md:block group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search..."
            className="h-8 pl-8 pr-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-[12px] focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400 outline-none transition-all w-48 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex items-center gap-0.5">
          <NotificationsDropdown />
          <button className="p-1.5 rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-all">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-zinc-200 mx-1.5" />

        {/* Profile */}
        <Link 
          href="/profile"
          className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-xl hover:bg-zinc-100 transition-all group active:scale-95"
        >
          <div className="flex flex-col items-end text-right">
            <div className="flex items-center gap-1.5 justify-end">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)] animate-pulse" />
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Ecosystem Active</span>
            </div>
            <span className="text-[12px] font-black text-[#1a365d] leading-tight group-hover:text-blue-600 transition-colors">Director</span>
            <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-400">Company Director</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#1a365d] flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:rotate-3 transition-transform">
             <span className="text-sm font-black text-white">D</span>
          </div>
        </Link>
      </div>
    </header>
  );
};
