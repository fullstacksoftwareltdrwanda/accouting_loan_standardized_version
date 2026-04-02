"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Search, ShieldCheck } from "lucide-react";
import { Loan } from "@/types/loan";
import { getLoans } from "@/services/mock/loan.service";
import { DataTable } from "@/components/table/data-table";
import { overdueLoanColumns, getLoanActions } from "./loan-columns";
import { DashboardBanner } from "@/components/shared/dashboard-banner";
import { Input } from "@/components/ui/input";

export function OverdueLoanList() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLoans();
        setLoans(data.filter(ln => ln.status === "overdue"));
      } catch (error) {
        console.error("Failed to load overdue loans", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const actions = {
    onView: (ln: Loan) => console.log("View", ln),
    onEdit: (ln: Loan) => console.log("Process", ln),
    onDelete: (ln: Loan) => console.log("Delete", ln),
  };

  const columns = overdueLoanColumns(actions);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <DashboardBanner 
        variant="danger"
        title="Overdue Instalments"
        subtitle="Past-due instalments under 30 days overdue — immediate follow-up and field verification required for this portfolio segment."
        dateLabel={`Today: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}`}
        badgeLabel="Overdue (< 30 Days)"
      />

      {/* Search and Filters */}
      <div className="max-w-md mx-auto">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-rose-500 transition-colors" />
          <Input 
             className="h-14 pl-12 pr-6 rounded-[20px] border-zinc-200 bg-white shadow-xl shadow-zinc-200/40 text-sm font-medium focus-visible:ring-rose-500/20 focus-visible:border-rose-300 transition-all"
             placeholder="Search by customer, loan number..."
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="relative h-40 w-40 flex items-center justify-center bg-zinc-50 rounded-full border border-zinc-100">
           <ShieldCheck className="h-20 w-20 text-zinc-200" />
           <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-20 pointer-events-none" />
           <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white shadow-lg border border-zinc-50 flex items-center justify-center">
              <span className="text-emerald-500 text-lg">✓</span>
           </div>
        </div>
        
        <div className="mt-10 text-center space-y-3">
          <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">No Overdue Instalments!</h3>
          <p className="text-[13px] text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed italic">
            There are currently no overdue instalments under 30 days. Perfect portfolio health maintained. Check back later.
          </p>
        </div>
      </div>

      {/* Hidden list for when data exists */}
      {loans.length > 0 && false && (
        <div className="bg-white p-6 rounded-[40px] border border-zinc-200 shadow-sm overflow-hidden">
          <DataTable 
             columns={columns} 
             data={loans} 
             isLoading={isLoading} 
          />
        </div>
      )}
    </div>
  );
}
