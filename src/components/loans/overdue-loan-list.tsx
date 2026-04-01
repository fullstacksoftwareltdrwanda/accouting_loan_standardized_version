"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Loan } from "@/types/loan";
import { getLoans } from "@/services/mock/loan.service";
import { DataTable } from "@/components/table/data-table";
import { overdueLoanColumns, getLoanActions } from "./loan-columns";

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

  const actions = getLoanActions(
    (ln: Loan) => console.log("View", ln),
    (ln: Loan) => console.log("Process", ln)
  );

  const columns = overdueLoanColumns(actions);

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-rose-600 font-sans">
            Overdue Collections
          </h2>
          <p className="text-zinc-500 font-sans dark:text-zinc-400">
            Immediate attention required. List of borrowers who have exceeded their payment deadlines.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 dark:bg-rose-900/10 dark:border-rose-900/20">
          <AlertCircle className="h-5 w-5" />
          <span className="text-xs font-black uppercase tracking-widest">High Priority Queue</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800">
        <DataTable 
          columns={columns} 
          data={loans} 
          isLoading={isLoading} 
          filterColumn="customerName"
          filterPlaceholder="Search overdue accounts..."
        />
      </div>
    </div>
  );
}
