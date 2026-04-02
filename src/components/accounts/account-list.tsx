"use client";

import React from "react";
import { GLAccount } from "@/types/account";
import { DataTable } from "@/components/table/data-table";
import { accountColumns, getAccountActions } from "./account-columns";
import { Button } from "@/components/ui/button";

interface AccountListProps {
  accounts: GLAccount[];
  isLoading: boolean;
}

export function AccountList({ accounts, isLoading }: AccountListProps) {
  const actions = getAccountActions(
    (acc) => console.log("Edit", acc),
    (acc) => console.log("View Ledger", acc)
  );

  const columns = accountColumns(actions);

  return (
    <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">Chart of Accounts</h3>
        <span className="text-[12px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-sunken)] px-3 py-1 rounded-lg">
          {accounts.length} accounts
        </span>
      </div>
      <DataTable 
        columns={columns} 
        data={accounts} 
        isLoading={isLoading} 
        filterColumn="name"
        filterPlaceholder="Search accounts..."
        emptyStateTitle="Empty Chart of Accounts"
        emptyStateDescription="No accounts defined yet. Build your financial ledger structure to get started."
        emptyStateAction={
          <Button 
            onClick={() => document.getElementById('add-account-btn')?.click()}
            className="h-10 px-6 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl font-medium text-[13px] gap-2 shadow-sm"
          >
            Create First Account
          </Button>
        }
      />
    </div>
  );
}
