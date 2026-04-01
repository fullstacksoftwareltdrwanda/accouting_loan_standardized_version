"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GLAccount, AccountCategory } from "@/types/account";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/currency";
import { DataTableAction } from "@/types/common";
import { RowActions } from "@/components/table/row-actions";
import { FileText, Edit, Trash, ArrowRightLeft } from "lucide-react";

export const getAccountActions = (
  onEdit: (account: GLAccount) => void,
  onViewLedger: (account: GLAccount) => void
): DataTableAction<GLAccount>[] => [
  {
    label: "View Ledger",
    icon: FileText,
    onClick: onViewLedger,
  },
  {
    label: "Adjust Balance",
    icon: ArrowRightLeft,
    onClick: (account) => console.log("Adjust balance", account),
  },
  {
    label: "Edit Account",
    icon: Edit,
    onClick: onEdit,
  },
  {
    label: "Deactivate",
    icon: Trash,
    variant: "danger",
    onClick: (account) => console.log("Deactivate", account),
    disabled: (account) => account.balance !== 0, // Cannot deactivate if balance exists
  },
];

export const accountColumns = (
  actions: DataTableAction<GLAccount>[]
): ColumnDef<GLAccount>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <span className="font-mono font-bold text-indigo-600">{row.getValue("code")}</span>,
  },
  {
    accessorKey: "name",
    header: "Account Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900 dark:text-zinc-50">{row.getValue("name")}</span>
        {row.original.description && (
          <span className="text-xs text-zinc-500 italic max-w-[200px] truncate">{row.original.description}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as AccountCategory;
      const colors: Record<AccountCategory, string> = {
        Asset: "text-blue-600 bg-blue-50 dark:bg-blue-900/10",
        Liability: "text-amber-600 bg-amber-50 dark:bg-amber-900/10",
        Equity: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10",
        Revenue: "text-violet-600 bg-violet-50 dark:bg-violet-900/10",
        Expense: "text-rose-600 bg-rose-50 dark:bg-rose-900/10",
      };
      return (
        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${colors[category]}`}>
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      const isNegative = amount < 0;
      return (
        <div className={`text-right font-mono font-black ${isNegative ? "text-rose-600" : "text-zinc-900 dark:text-zinc-50"}`}>
          {formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} actions={actions} />,
  },
];
