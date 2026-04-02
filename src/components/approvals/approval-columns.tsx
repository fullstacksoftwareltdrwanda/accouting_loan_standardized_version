"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ApprovalRequest, ApprovalType } from "@/types/approval";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/currency";
import { DataTableAction } from "@/types/common";
import { RowActions } from "@/components/table/row-actions";
import { CheckCircle2, XCircle, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <span className="text-[11px] font-black text-zinc-400 group-hover:text-zinc-600 transition-colors">
        {row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-extrabold text-[12px] text-[#1a365d] dark:text-blue-400 uppercase tracking-tight">
          {row.original.action}
        </span>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{row.original.type}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[280px]">
        <p className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400 line-clamp-1 italic">
          {row.original.description || row.original.title}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "requester",
    header: "Submitted By",
    cell: ({ row }) => (
       <div className="flex items-center gap-2 group/user">
          <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-600 border border-blue-100 group-hover/user:bg-blue-600 group-hover/user:text-white transition-all">
            {row.original.requester.charAt(0)}
          </div>
          <span className="text-[12px] font-bold text-zinc-700 dark:text-zinc-300">
            {row.original.requester}
          </span>
       </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
       <span className="font-mono text-[11px] text-zinc-500 font-bold whitespace-nowrap">
         {row.original.date}
       </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
          status === "pending" && "bg-amber-50 text-amber-600 border-amber-200",
          status === "active" && "bg-emerald-50 text-emerald-600 border-emerald-200",
          status === "inactive" && "bg-rose-50 text-rose-600 border-rose-200",
        )}>
          <div className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse",
            status === "pending" && "bg-amber-400",
            status === "active" && "bg-emerald-400",
            status === "inactive" && "bg-rose-400",
          )} />
          {status === "active" ? "Approved" : status === "inactive" ? "Rejected" : "Pending"}
        </div>
      );
    }
  },
  {
    accessorKey: "reviewedBy",
    header: "Reviewed By",
    cell: ({ row }) => (
       <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest italic shrink-0">
         {row.original.reviewedBy || "--"}
       </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      if (row.original.status !== "pending") return (
        <RowActions row={row} actions={actions} />
      );
      
      return (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-lg border-emerald-100 bg-emerald-50/50 hover:bg-emerald-600 hover:text-white text-emerald-600 transition-all active:scale-95 shadow-sm"
            onClick={() => onQuickApprove(row.original.id)}
            title="Approve"
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-lg border-rose-100 bg-rose-50/50 hover:bg-rose-600 hover:text-white text-rose-600 transition-all active:scale-95 shadow-sm"
            onClick={() => onQuickReject(row.original.id)}
            title="Reject"
          >
            <XCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-zinc-400 hover:text-blue-600 transition-colors"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
