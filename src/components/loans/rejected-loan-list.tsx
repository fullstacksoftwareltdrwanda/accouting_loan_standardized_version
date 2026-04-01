"use client";

import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import { Loan } from "@/types/loan";
import { getLoans } from "@/services/mock/loan.service";
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

  const actions = getLoanActions(
    (ln: Loan) => console.log("View", ln),
    (ln: Loan) => console.log("Process", ln)
  );

  const columns = rejectedLoanColumns(actions);

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
          Rejected Loans
        </h2>
        <p className="text-zinc-500 font-sans dark:text-zinc-400">
          Historical record of denied applications and the reasons for rejection.
        </p>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800">
        <DataTable 
          columns={columns} 
          data={loans} 
          isLoading={isLoading} 
          filterColumn="customerName"
          filterPlaceholder="Search rejected history..."
        />
      </div>
    </div>
  );
}
