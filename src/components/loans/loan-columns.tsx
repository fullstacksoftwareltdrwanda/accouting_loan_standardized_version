"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Loan } from "@/types/loan";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/currency";
import { DataTableAction } from "@/types/common";
import { RowActions } from "@/components/table/row-actions";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Eye, Edit, Trash, DollarSign } from "lucide-react";

export const getLoanActions = (
  onView: (loan: Loan) => void,
  onRepay: (loan: Loan) => void
): DataTableAction<Loan>[] => [
  {
    label: "View Details",
    icon: Eye,
    onClick: onView,
  },
  {
    label: "Process Repayment",
    icon: DollarSign,
    onClick: onRepay,
  },
  {
    label: "Modify Terms",
    icon: Edit,
    onClick: (loan) => console.log("Edit", loan),
  },
  {
    label: "Close Loan",
    icon: Trash,
    variant: "danger",
    onClick: (loan) => console.log("Close", loan),
    disabled: (loan) => loan.totalPaid < loan.totalPayable,
  },
];

export const getRequestedLoanActions = (
  onApprove: (loan: Loan) => void,
  onReject: (loan: Loan) => void
): DataTableAction<Loan>[] => [
  {
    label: "Approve Application",
    icon: Eye,
    onClick: onApprove,
    variant: "default",
  },
  {
    label: "Reject Application",
    icon: Trash,
    onClick: onReject,
    variant: "danger",
  },
];

export const loanColumns = (
  actions: DataTableAction<Loan>[]
): ColumnDef<Loan>[] => [
  {
    accessorKey: "loanNumber",
    header: "Loan #",
    cell: ({ row }) => <span className="font-mono font-black text-indigo-600">{row.getValue("loanNumber")}</span>,
  },
  {
    accessorKey: "customerName",
    header: "Borrower",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900 dark:text-zinc-50">{row.getValue("customerName")}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{row.original.category}</span>
      </div>
    ),
  },
  {
    accessorKey: "principal",
    header: "Principal",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(row.original.principal)}</span>
        <span className="text-xs text-zinc-500 font-sans">{row.original.interestRate}% Int.</span>
      </div>
    ),
  },
  {
    accessorKey: "repayment",
    header: "Repayment Progress",
    cell: ({ row }) => {
      const loan = row.original;
      const percentage = (loan.totalPaid / loan.totalPayable) * 100;
      return (
        <div className="w-[160px] space-y-1.5">
          <ProgressBar value={loan.totalPaid} max={loan.totalPayable} />
          <div className="flex justify-between text-[10px] font-black uppercase tracking-tight text-zinc-400">
            <span>{formatCurrency(loan.totalPaid)}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
];

export const requestedLoanColumns = (
  actions: DataTableAction<Loan>[]
): ColumnDef<Loan>[] => {
  const base = loanColumns(actions).filter(c => (c as any).id !== "actions");
  return [
    ...base,
    {
      accessorKey: "startDate",
      header: "Applied Date",
    },
    {
      id: "actions",
      cell: ({ row }) => <RowActions row={row} actions={actions} />,
    },
  ];
};

export const overdueLoanColumns = (
  actions: DataTableAction<Loan>[]
): ColumnDef<Loan>[] => {
  const base = loanColumns(actions).filter(c => 
    (c as any).id !== "actions" && (c as any).accessorKey !== "repayment"
  );
  return [
    ...base,
    {
      accessorKey: "overdueDays",
      header: "Days Overdue",
      cell: () => <span className="text-rose-600 font-black">15 Days</span>,
    },
    {
      accessorKey: "penalty",
      header: "Penalty",
      cell: () => <span className="text-rose-600 font-black">{formatCurrency(250)}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => <RowActions row={row} actions={actions} />,
    },
  ];
};

export const rejectedLoanColumns = (
  actions: DataTableAction<Loan>[]
): ColumnDef<Loan>[] => {
  const base = loanColumns(actions).filter(c => (c as any).id !== "actions");
  return [
    ...base,
    {
      accessorKey: "reason",
      header: "Rejection Reason",
      cell: () => <span className="text-xs text-zinc-500 italic">Insufficient Credit Score</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => <RowActions row={row} actions={actions} />,
    },
  ];
};
