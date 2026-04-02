"use client";

import React from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { MobileNav } from "./mobile-nav";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex min-h-screen w-full bg-[var(--bg-canvas)]">
      {/* Sidebar — Navigation (desktop only) */}
      <div className="hidden lg:block w-64 shrink-0">
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader />

        <main className="flex-1 overflow-x-hidden">
          {/* pb-20 on mobile to prevent content being hidden behind bottom nav */}
          <div className="mx-auto max-w-[1360px] px-4 md:px-6 lg:px-10 py-4 md:py-6 lg:py-8 pb-24 lg:pb-8">
            {children}
          </div>
        </main>

        <footer className="hidden lg:block py-3 px-6 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-disabled)]">
            <span>© {new Date().getFullYear()} ALMS Financial Platform</span>
            <div className="flex items-center gap-4">
              <button className="hover:text-[var(--accent-primary)] transition-colors">Docs</button>
              <button className="hover:text-[var(--accent-primary)] transition-colors">Privacy</button>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Nav + Drawer */}
      <MobileNav />
    </div>
  );
};
