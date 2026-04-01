"use client";

import React from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-[#02040a]">
      {/* Sidebar - Fixed width on desktop */}
      <div className="hidden lg:block w-72 shrink-0">
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader />
        
        <main className="flex-1 p-6 md:p-8 lg:p-10 animate-in fade-in duration-500">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        <footer className="py-6 px-10 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#050505]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] items-center font-extrabold uppercase tracking-widest text-zinc-500">
                <p>© {new Date().getFullYear()} ALMS Standardized Version. Security Protocol v1.4.2</p>
                <div className="flex gap-6">
                    <button className="hover:text-indigo-600 transition-colors">Documentation</button>
                    <button className="hover:text-indigo-600 transition-colors">Privacy Policy</button>
                    <button className="hover:text-indigo-600 transition-colors">Data Processing</button>
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
};
