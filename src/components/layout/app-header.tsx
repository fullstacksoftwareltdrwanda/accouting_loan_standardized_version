"use client";

import React from "react";
import { User, Search, Settings, HelpCircle, LogOut } from "lucide-react";
import { BreadcrumbBar } from "./breadcrumb-bar";
import { NotificationsDropdown } from "../shared/notifications-dropdown";

export const AppHeader = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-8 dark:border-zinc-800 dark:bg-[#050505]/80 backdrop-blur-md">
      <div className="flex items-center gap-8">
        <BreadcrumbBar />
      </div>

      <div className="flex items-center gap-4">
        {/* Search Placeholder */}
        <div className="hidden relative md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search across ALMS..."
            className="h-10 pl-10 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all w-64 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 placeholder:text-zinc-500"
          />
        </div>

        <div className="flex items-center gap-1">
          <NotificationsDropdown />
          <button className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />

        {/* Profile Dropdown Placeholder */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="flex flex-col items-end text-right">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">Admin User</span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400">System Chief</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-100 to-indigo-50 border border-indigo-200 flex items-center justify-center dark:from-indigo-900/50 dark:to-indigo-500/20 dark:border-indigo-500/30 shadow-sm group-hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
