"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/customer";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/currency";
import { DataTableAction } from "@/types/common";
import { RowActions } from "@/components/table/row-actions";
import { User, Eye, Edit, Trash, CreditCard } from "lucide-react";

export const getCustomerActions = (
  onView: (customer: Customer) => void,
  onEdit: (customer: Customer) => void
): DataTableAction<Customer>[] => [
  {
    label: "View Profile",
    icon: Eye,
    onClick: onView,
  },
  {
    label: "Edit Details",
    icon: Edit,
    onClick: onEdit,
  },
  {
    label: "View Loans",
    icon: CreditCard,
    onClick: (customer) => console.log("View loans for", customer),
  },
  {
    label: "Deactivate",
    icon: Trash,
    variant: "danger",
    onClick: (customer) => console.log("Deactivate", customer),
    disabled: (customer) => customer.financials.activeBalance > 0,
  },
];

export const customerColumns = (
  actions: DataTableAction<Customer>[]
): ColumnDef<Customer>[] => [
  {
    accessorKey: "profile",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original;
      const initials = `${customer.firstName[0]}${customer.lastName[0]}`;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 font-black text-zinc-600 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-zinc-900 dark:text-zinc-50">
              {customer.firstName} {customer.lastName}
            </span>
            <span className="text-xs text-zinc-500 font-sans">{customer.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Contact",
    cell: ({ row }) => <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 font-sans">{row.getValue("phone")}</span>,
  },
  {
    accessorKey: "financials.totalLoans",
    header: () => <div className="text-center">Loans</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-50 font-bold text-xs text-zinc-600 border border-zinc-100 dark:bg-white/5 dark:border-white/10 dark:text-zinc-400">
          {row.original.financials.totalLoans}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "financials.activeBalance",
    header: () => <div className="text-right">Active Balance</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.financials.activeBalance.toString());
      return (
        <div className="text-right font-mono font-black text-zinc-900 dark:text-zinc-50">
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
