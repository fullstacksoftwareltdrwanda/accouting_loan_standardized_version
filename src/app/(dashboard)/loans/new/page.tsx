"use client";

import Link from "next/link";
import { ChevronRight, Home, LayoutDashboard } from "lucide-react";
import { LoanForm } from "@/components/loans/add-loan-form";

export default function AddLoanPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 px-1">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
        <Link 
          href="/loans" 
          className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
        <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Create New Loan</span>
      </nav>

      {/* Form Container */}
      <div className="max-w-5xl mx-auto">
        <LoanForm />
      </div>
    </div>
  );
}
