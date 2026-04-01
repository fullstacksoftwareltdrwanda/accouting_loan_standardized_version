"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Expense, ExpenseCategory } from "@/types/expense";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/currency";
import { DataTableAction } from "@/types/common";
import { RowActions } from "@/components/table/row-actions";
import { Receipt, Edit, Trash, FileText } from "lucide-react";
// I'll use simple string dates to avoid hydration mess for now as seen previously

export const getExpenseActions = (
  onEdit: (expense: Expense) => void,
  onViewDoc: (expense: Expense) => void
): DataTableAction<Expense>[] => [
  {
    label: "View Receipt",
    icon: FileText,
    onClick: onViewDoc,
  },
  {
    label: "Edit Entry",
    icon: Edit,
    onClick: onEdit,
  },
  {
    label: "Delete Record",
    icon: Trash,
    variant: "danger",
    onClick: (expense) => console.log("Delete", expense),
  },
];

export const expenseColumns = (
  actions: DataTableAction<Expense>[]
): ColumnDef<Expense>[] => [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="font-sans text-xs text-zinc-500 font-bold">{row.getValue("date")}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
          <Receipt className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-zinc-900 dark:text-zinc-50">{row.getValue("description")}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ref: {row.original.reference || "N/A"}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as ExpenseCategory;
      const colors: Record<ExpenseCategory, string> = {
        "Fixed Cost": "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10",
        "Variable Cost": "text-amber-600 bg-amber-50 dark:bg-amber-900/10",
        "Administrative": "text-zinc-600 bg-zinc-50 dark:bg-zinc-800",
        "Financial": "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10",
        "Marketing": "text-violet-600 bg-violet-50 dark:bg-violet-900/10",
        "Salaries": "text-rose-600 bg-rose-50 dark:bg-rose-900/10",
      };
      return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[category]}`}>
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "accountCode",
    header: "GL Account",
    cell: ({ row }) => <span className="font-mono font-black text-indigo-600">{row.getValue("accountCode")}</span>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono font-black text-rose-600">
        {formatCurrency(row.getValue("amount"))}
      </div>
    ),
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
