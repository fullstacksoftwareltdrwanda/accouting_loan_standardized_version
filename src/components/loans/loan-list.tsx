"use client";

import React, { useState, useEffect } from "react";
import { Plus, HandCoins } from "lucide-react";
import { Loan } from "@/types/loan";
import { getLoans, createLoan } from "@/services/mock/loan.service";
import { DataTable } from "@/components/table/data-table";
import { loanColumns, getLoanActions } from "./loan-columns";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { NEW_LOAN_FORM_CONFIG } from "@/config/forms/loan-form.config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LoanList() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load loans
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLoans();
        setLoans(data);
      } catch (error) {
        console.error("Failed to load loans", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Handlers
  const handleApplyLoan = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Mock customer name lookup since we'd do this from session/select in real app
      const mockCustomerName = "John Smith (cust_1)";
      const newLn = await createLoan({ ...data, customerName: mockCustomerName });
      setLoans((prev) => [newLn, ...prev]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Loan application failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = getLoanActions(
    (ln) => console.log("View", ln),
    (ln) => console.log("Process", ln)
  );

  const columns = loanColumns(actions);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            Loan Portfolio
          </h2>
          <p className="text-zinc-500 font-sans dark:text-zinc-400">
            Track active loans, repayment progress, and manage new applications.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black shadow-md transition-all active:scale-95">
              <HandCoins className="mr-2 h-5 w-5" />
              New Loan Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Loan Application Form</DialogTitle>
              <DialogDescription>
                Define the principal, term, and borrower for the new loan application.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <DynamicForm 
                config={NEW_LOAN_FORM_CONFIG} 
                onSubmit={handleApplyLoan} 
                isLoading={isSubmitting} 
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Area */}
      <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800">
        <DataTable 
          columns={columns} 
          data={loans} 
          isLoading={isLoading} 
          filterColumn="customerName"
          filterPlaceholder="Search by borrower name or loan #..."
        />
      </div>
    </div>
  );
}
