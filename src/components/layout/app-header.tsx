"use client";

import React from "react";
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
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="flex flex-col items-end text-right">
            <span className="text-[11px] font-semibold text-zinc-700 leading-tight">Admin User</span>
            <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-500">System Chief</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-100 to-indigo-50 border border-indigo-200/60 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <User className="w-3.5 h-3.5 text-indigo-600" />
          </div>
        </div>
      </div>
    </header>
  );
};
