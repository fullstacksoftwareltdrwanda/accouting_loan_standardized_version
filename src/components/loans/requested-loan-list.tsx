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

  const actions = getRequestedLoanActions(
    (ln: Loan) => console.log("Approve", ln),
    (ln: Loan) => console.log("Reject", ln)
  );

  const columns = requestedLoanColumns(actions);

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
          Requested Loans
        </h2>
        <p className="text-zinc-500 font-sans dark:text-zinc-400">
          Review and verify new loan applications awaiting administrative approval.
        </p>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800">
        <DataTable 
          columns={columns} 
          data={loans} 
          isLoading={isLoading} 
          filterColumn="customerName"
          filterPlaceholder="Search requested loans..."
        />
      </div>
    </div>
  );
}
