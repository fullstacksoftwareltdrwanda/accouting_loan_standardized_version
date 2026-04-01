"use client";

import React, { useState, useEffect } from "react";
import { Plus, Layout } from "lucide-react";
import { GLAccount } from "@/types/account";
import { getAccounts, createAccount } from "@/services/mock/account.service";
import { DataTable } from "@/components/table/data-table";
import { accountColumns, getAccountActions } from "./account-columns";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { NEW_ACCOUNT_FORM_CONFIG } from "@/config/forms/account-form.config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AccountList() {
  const [accounts, setAccounts] = useState<GLAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load accounts
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAccounts();
        setAccounts(data);
      } catch (error) {
        console.error("Failed to load accounts", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Handlers
  const handleCreateAccount = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newAcc = await createAccount(data);
      setAccounts((prev) => [...prev, newAcc].sort((a, b) => a.code.localeCompare(b.code)));
      setIsDialogOpen(false);
      // In a real app, we'd trigger a toast here
    } catch (error) {
      console.error("Creation failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = getAccountActions(
    (acc) => console.log("Edit", acc),
    (acc) => console.log("View Ledger", acc)
  );

  const columns = accountColumns(actions);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            Chart of Accounts
          </h2>
          <p className="text-zinc-500 font-sans dark:text-zinc-400">
            Manage your General Ledger structure and initial balances.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black shadow-md transition-all active:scale-95">
              <Plus className="mr-2 h-5 w-5" />
              New Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Create Ledger Account</DialogTitle>
              <DialogDescription>
                Define a new account in your chart. Ensure the code matches your accounting standards.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <DynamicForm 
                config={NEW_ACCOUNT_FORM_CONFIG} 
                onSubmit={handleCreateAccount} 
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
          data={accounts} 
          isLoading={isLoading} 
          filterColumn="name"
          filterPlaceholder="Search by account name or code..."
        />
      </div>
    </div>
  );
}
