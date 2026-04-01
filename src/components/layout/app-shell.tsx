"use client";

import React from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fb]">
      {/* Sidebar - Fixed width on desktop */}
      <div className="hidden lg:block w-[250px] shrink-0">
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader />
        
        <main className="flex-1 p-4 md:p-6 animate-in fade-in duration-500">
          <div className="mx-auto max-w-[1440px]">
            {children}
          </div>
        </main>

        <footer className="py-4 px-6 border-t border-zinc-200/60 bg-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                <p>© {new Date().getFullYear()} ALMS Standardized. Security Protocol v1.4.2</p>
                <div className="flex gap-5">
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
