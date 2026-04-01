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
    // Hidden column used purely for name-based filtering
    id: "firstName",
    accessorFn: (row) => `${row.firstName} ${row.lastName} ${row.email}`,
    header: () => null,
    cell: () => null,
    enableHiding: false,
  },
  {
    accessorKey: "profile",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original;
      const initials = `${customer.firstName[0]}${customer.lastName[0]}`;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 font-semibold text-[12px] text-zinc-600 border border-zinc-200">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-800 text-[13px]">
              {customer.firstName} {customer.lastName}
            </span>
            <span className="text-[11px] text-zinc-400">{customer.email}</span>
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
