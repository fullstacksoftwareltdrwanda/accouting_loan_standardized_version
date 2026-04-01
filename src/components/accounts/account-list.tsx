"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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
    <div className="space-y-5 max-w-[1440px]">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight text-zinc-800">
            Chart of Accounts
          </h2>
          <p className="text-[12px] text-zinc-400">
            Manage your General Ledger structure and initial balances.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-sm text-[13px]">
              <Plus className="mr-1.5 h-4 w-4" />
              New Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Create Ledger Account</DialogTitle>
              <DialogDescription className="text-[12px] text-zinc-400">
                Define a new account in your chart. Ensure the code matches your accounting standards.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
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
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
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
