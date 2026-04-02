"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, Settings, X, 
  ArrowRight, FileText, ChevronRight, Home,
  CreditCard, Users
} from "lucide-react";
import { NotificationsDropdown } from "../shared/notifications-dropdown";
import { cn } from "@/lib/utils";
import { topNavItems, navigationConfig } from "@/config/navigation";

export const AppHeader = () => {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (commandOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [commandOpen]);

  // Build breadcrumbs from pathname
  const paths = pathname.split("/").filter((p) => p !== "");

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-[var(--border-subtle)] bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between w-full px-6">
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <nav className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)]">
              <Link href="/dashboard" className="hover:text-[var(--accent-primary)] transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              {paths.map((path, index) => {
                if (path === "dashboard" && index === 0) return null;
                const href = `/${paths.slice(0, index + 1).join("/")}`;
                const isLast = index === paths.length - 1;
                const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
                return (
                  <React.Fragment key={path}>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--border-strong)]" />
                    {isLast ? (
                      <span className="text-[var(--text-primary)] font-semibold truncate">{label}</span>
                    ) : (
                      <Link href={href} className="hover:text-[var(--accent-primary)] transition-colors truncate">
                        {label}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Center: Module Tabs */}
          <div className="hidden lg:flex items-center gap-1 bg-[var(--bg-sunken)] rounded-2xl p-1.5">
            {topNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-2 px-3 h-9 rounded-xl transition-all duration-200 text-[13px] font-semibold",
                    isActive
                      ? "bg-white text-teal-600 shadow-sm shadow-teal-500/10"
                      : "text-[var(--text-tertiary)] hover:bg-white/60 hover:text-[var(--text-secondary)]"
                  )}
                >
                  <item.icon className={cn(
                    "w-[16px] h-[16px] transition-transform duration-200",
                    isActive && "scale-110"
                  )} />
                  <span>{item.title}</span>

                  {/* Active dot indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Mobile search icon */}
            <button
              onClick={() => setCommandOpen(true)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)] transition-all"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Command Palette Trigger (desktop) */}
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden md:flex items-center gap-3 h-9 pl-3 pr-2 rounded-xl bg-[var(--bg-sunken)] border border-[var(--border-subtle)] text-[var(--text-tertiary)] text-sm hover:border-[var(--border-default)] hover:text-[var(--text-secondary)] transition-all"
            >
              <Search className="w-4 h-4" />
              <span className="text-[13px]">Search...</span>
              <kbd className="hidden lg:inline-flex h-5 items-center gap-0.5 rounded-md border border-[var(--border-default)] bg-white px-1.5 font-mono text-[10px] font-medium text-[var(--text-tertiary)]">
                ⌘K
              </kbd>
            </button>

            <NotificationsDropdown />

            <button className="flex items-center justify-center w-9 h-9 rounded-xl text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)] transition-all">
              <Settings className="w-[18px] h-[18px]" />
            </button>

            <div className="h-6 w-px bg-[var(--border-subtle)] mx-1" />

            {/* Profile Pill */}
            <Link 
              href="/profile"
              className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full hover:bg-[var(--bg-hover)] transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:shadow-md transition-shadow">
                D
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">Director</span>
                <span className="text-[10px] text-[var(--text-tertiary)] leading-tight">Admin</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ Command Palette Overlay ═══ */}
      {commandOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[var(--text-primary)]/30 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => { setCommandOpen(false); setSearchQuery(""); }}
          />
          
          {/* Command Box */}
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-[var(--border-default)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border-subtle)]">
              <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages, actions, or records..."
                className="flex-1 bg-transparent outline-none text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)]"
              />
              <button 
                onClick={() => { setCommandOpen(false); setSearchQuery(""); }}
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--bg-sunken)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-2 max-h-[320px] overflow-y-auto">
              <div className="px-3 py-2 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Quick Navigation</div>
              {topNavItems
                .filter(item => 
                  !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { setCommandOpen(false); setSearchQuery(""); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-sunken)] group-hover:bg-[var(--accent-primary-ghost)] transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}

              <div className="px-3 py-2 mt-1 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Actions</div>
              {[
                { label: "Create New Loan", href: "/loans/new", icon: CreditCard },
                { label: "Add Customer", href: "/customers/add", icon: Users },
                { label: "Log Expense", href: "/expenses", icon: FileText },
              ]
                .filter(item => 
                  !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { setCommandOpen(false); setSearchQuery(""); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-sunken)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
              <span>Navigate with ↑↓ • Select with ↵</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
