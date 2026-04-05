"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Expense } from "@/types/expense";
import { getExpenses, createExpense } from "@/services/expense.service";
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
    <div className="space-y-8 animate-float-in">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Business Expenditures
          </h1>
          <p className="text-[13px] text-[var(--text-tertiary)]">
            Monitor cash outflows, categorize costs, and manage expenses
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 px-5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl font-medium text-[13px] gap-2 shadow-sm transition-all active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              Log Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[var(--text-primary)]">Log Business Expenditure</DialogTitle>
              <DialogDescription className="text-[var(--text-tertiary)]">
                Record a new expense. Ensure the GL Account matches the Chart of Accounts.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <DynamicForm 
                config={LOG_EXPENSE_FORM_CONFIG} 
                onSubmit={handleLogExpense} 
                isLoading={isSubmitting} 
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">Expenditure Log</h3>
          <span className="text-[12px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-sunken)] px-3 py-1 rounded-lg">
            {expenses.length} records
          </span>
        </div>
        <DataTable 
          columns={columns} 
          data={expenses} 
          isLoading={isLoading} 
          filterColumn="description"
          filterPlaceholder="Search expenditures..."
          emptyStateTitle="No Expenditures Found"
          emptyStateDescription="Your expense log is empty. Record your first cash outflow to begin tracking costs."
          emptyStateAction={
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="h-10 px-6 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl font-medium text-[13px] gap-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Log First Expense
            </Button>
          }
        />
      </div>
    </div>
  );
}
