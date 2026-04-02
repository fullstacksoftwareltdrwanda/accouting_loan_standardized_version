"use client";

import React from "react";
import { List } from "lucide-react";
import { GLAccount } from "@/types/account";
import { DataTable } from "@/components/table/data-table";
import { accountColumns, getAccountActions } from "./account-columns";

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
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#5c636a] px-4 py-2.5 text-white">
        <div className="flex items-center gap-2">
          <List className="h-4 w-4" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Accounts List</h3>
        </div>
        <div className="rounded bg-white/20 px-2 py-0.5 text-[11px] font-bold">
          {accounts.length} accounts
        </div>
      </div>

      {/* Table Area */}
      <div className="p-0">
        <style jsx global>{`
          .accounts-table thead tr {
            border-top: 2px solid #3b82f6 !important;
          }
        `}</style>
        <div className="accounts-table">
          <DataTable 
            columns={columns} 
            data={accounts} 
            isLoading={isLoading} 
            filterColumn="name"
            filterPlaceholder="Search by account name or code..."
          />
        </div>
      </div>
    </div>
  );
}
