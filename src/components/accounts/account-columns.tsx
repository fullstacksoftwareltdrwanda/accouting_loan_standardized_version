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
  onViewLedger: (account: GLAccount) => void,
  onDeactivate: (account: GLAccount) => void
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
    onClick: onDeactivate,
  },
];

export const accountColumns = (
  actions: DataTableAction<GLAccount>[]
): ColumnDef<GLAccount>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <span className="font-semibold text-rose-500">{row.getValue("code")}</span>,
  },
  {
    accessorKey: "name",
    header: "Account Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-zinc-700">{row.getValue("name")}</span>
        <span className="text-[11px] text-zinc-400 font-medium">{row.original.subType}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Type",
    cell: ({ row }) => {
      const category = row.getValue("category") as AccountCategory;
      const colors: Record<AccountCategory, string> = {
        Asset: "bg-blue-600 text-white",
        Liability: "bg-amber-500 text-white",
        Equity: "bg-emerald-500 text-white",
        Revenue: "bg-indigo-500 text-white",
        Expense: "bg-rose-500 text-white",
        "Balance Sheet": "bg-slate-500 text-white",
        "Income Statement": "bg-teal-500 text-white",
      };
      return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colors[category]}`}>
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "normalBalance",
    header: "Balance",
    cell: ({ row }) => <span className="font-semibold text-zinc-700">{row.getValue("normalBalance")}</span>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isActive ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} actions={actions} />,
  },
];
