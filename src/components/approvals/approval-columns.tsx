"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ApprovalRequest, ApprovalType } from "@/types/approval";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/currency";
import { DataTableAction } from "@/types/common";
import { RowActions } from "@/components/table/row-actions";
import { CheckCircle2, XCircle, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const getApprovalActions = (
  onApprove: (req: ApprovalRequest) => void,
  onReject: (req: ApprovalRequest) => void
): DataTableAction<ApprovalRequest>[] => [
  {
    label: "Approve Request",
    icon: CheckCircle2,
    onClick: onApprove,
    variant: "default",
  },
  {
    label: "Reject Request",
    icon: XCircle,
    onClick: onReject,
    variant: "danger",
  },
  {
    label: "View Details",
    icon: FileText,
    onClick: (req) => console.log("View", req),
  },
];

export const approvalColumns = (
  actions: DataTableAction<ApprovalRequest>[],
  onQuickApprove: (id: string) => void,
  onQuickReject: (id: string) => void
): ColumnDef<ApprovalRequest>[] => [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="font-sans text-xs text-zinc-500 font-bold">{row.getValue("date")}</span>,
  },
  {
    accessorKey: "title",
    header: "Request Title",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900 dark:text-zinc-50">{row.getValue("title")}</span>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <User className="h-3 w-3" />
          By: {row.original.requester}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as ApprovalType;
      const colors: Record<ApprovalType, string> = {
        Loan: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10",
        Expense: "text-rose-600 bg-rose-50 dark:bg-rose-900/10",
        Account: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10",
        Adjustment: "text-amber-600 bg-amber-50 dark:bg-amber-900/10",
      };
      return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[type]}`}>
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Value</div>,
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number | undefined;
      return (
        <div className="text-right font-mono font-black text-zinc-900 dark:text-zinc-50">
          {amount ? formatCurrency(amount) : "--"}
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
    id: "quickActions",
    header: () => <div className="text-center">Quick Decision</div>,
    cell: ({ row }) => {
      if (row.original.status !== "pending") return null;
      return (
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => onQuickApprove(row.original.id)}
            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            title="Approve"
          >
            <CheckCircle2 className="h-5 w-5" />
          </button>
          <button 
            onClick={() => onQuickReject(row.original.id)}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            title="Reject"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} actions={actions} />,
  },
];
