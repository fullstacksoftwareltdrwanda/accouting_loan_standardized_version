"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Loan } from "@/types/loan";
import { getLoans } from "@/services/mock/loan.service";
import { DataTable } from "@/components/table/data-table";
import { requestedLoanColumns, getRequestedLoanActions } from "./loan-columns";

export function RequestedLoanList() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLoans();
        setLoans(data.filter(ln => ln.status === "pending"));
      } catch (error) {
        console.error("Failed to load requested loans", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const actions = {
    onView: (ln: Loan) => console.log("Approve", ln),
    onEdit: (ln: Loan) => console.log("Approve", ln),
    onDelete: (ln: Loan) => console.log("Reject", ln),
  };

  const columns = requestedLoanColumns(actions);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="space-y-3 px-1">
        <div className="flex items-center gap-3">
           <Clock className="h-6 w-6 text-blue-600" />
           <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">
             Requested Loans
           </h2>
        </div>
        <p className="text-[13px] text-zinc-500 font-medium max-w-2xl leading-relaxed">
          Manage and process new loan applications accurately. Review borrower documentation and verify financial eligibility before administrative approval.
        </p>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[40px] border border-zinc-200 shadow-2xl shadow-zinc-200/50 overflow-hidden dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none">
        <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 dark:border-zinc-800">
           <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="text-[13px] font-black uppercase tracking-widest text-[#1a365d] dark:text-blue-400">Active Requests</h3>
           </div>
           <div className="px-5 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest">
             {loans.length} Total
           </div>
        </div>
        
        <div className="p-0">
          <DataTable 
            columns={columns} 
            data={loans} 
            isLoading={isLoading} 
            filterColumn="customerName"
            filterPlaceholder="Search by applicant name, requested code..."
          />
        </div>
      </div>
    </div>
  );
}
