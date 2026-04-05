"use client";

import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import { Loan } from "@/types/loan";
import { getLoans } from "@/services/loan.service";
import { DataTable } from "@/components/table/data-table";
import { rejectedLoanColumns, getLoanActions } from "./loan-columns";

export function RejectedLoanList() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLoans();
        setLoans(data.filter(ln => ln.status === "rejected"));
      } catch (error) {
        console.error("Failed to load rejected loans", error);
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

  const columns = rejectedLoanColumns(actions);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="space-y-3 px-1">
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
             <XCircle className="h-6 w-6 text-rose-600" />
           </div>
           <h2 className="text-3xl font-black tracking-tighter text-rose-600 uppercase">
             Rejected Applications
           </h2>
        </div>
        <p className="text-[13px] text-zinc-500 font-medium max-w-2xl leading-relaxed">
          Historical record of denied loan applications and documentations. Review previously rejected profiles, restore eligibility where applicable, or permanently clear historical records.
        </p>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[40px] border border-rose-100 shadow-2xl shadow-rose-200/30 overflow-hidden dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none">
        <div className="px-8 py-5 border-b border-rose-50 flex items-center justify-between bg-rose-50/20 dark:bg-zinc-900/50 dark:border-zinc-800">
           <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-[13px] font-black uppercase tracking-widest text-rose-900 dark:text-rose-400">Rejected Applicants</h3>
           </div>
           <div className="px-5 py-1.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest">
             {loans.length} Records
           </div>
        </div>
        
        <div className="p-0">
          <DataTable 
            columns={columns} 
            data={loans} 
            isLoading={isLoading} 
            filterColumn="customerName"
            filterPlaceholder="Search rejected history, restoration codes..."
          />
        </div>
      </div>
    </div>
  );
}
