"use client";

import React, { useState, useEffect } from "react";
import { Plus, ReceiptText } from "lucide-react";
import { Expense } from "@/types/expense";
import { getExpenses, createExpense } from "@/services/mock/expense.service";
import { DataTable } from "@/components/table/data-table";
import { expenseColumns, getExpenseActions } from "./expense-columns";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { LOG_EXPENSE_FORM_CONFIG } from "@/config/forms/expense-form.config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load expenses
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (error) {
        console.error("Failed to load expenses", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Handlers
  const handleLogExpense = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newExp = await createExpense(data);
      setExpenses((prev) => [newExp, ...prev]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Logging failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = getExpenseActions(
    (exp) => console.log("Edit", exp),
    (exp) => console.log("View Receipt", exp)
  );

  const columns = expenseColumns(actions);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            Business Expenditures
          </h2>
          <p className="text-zinc-500 font-sans dark:text-zinc-400">
            Monitor cash outflows, categorize costs, and manage fixed/variable expenses.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black shadow-md transition-all active:scale-95">
              <Plus className="mr-2 h-5 w-5" />
              Log Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Log Business Expenditure</DialogTitle>
              <DialogDescription>
                Record a new expense. Ensure the GL Account matches the Chart of Accounts.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <DynamicForm 
                config={LOG_EXPENSE_FORM_CONFIG} 
                onSubmit={handleLogExpense} 
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
          data={expenses} 
          isLoading={isLoading} 
          filterColumn="description"
          filterPlaceholder="Search expenditures by description or ref..."
        />
      </div>
    </div>
  );
}
