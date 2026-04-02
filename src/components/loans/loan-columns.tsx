"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Loan } from "@/types/loan";
import { 
  Eye, 
  Edit2, 
  Trash2, 
  MoreHorizontal, 
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const loanColumns = (actions: {
  onView: (loan: Loan) => void;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
}): ColumnDef<Loan>[] => [
  {
    accessorKey: "loanNumber",
    header: "Loan #",
    cell: ({ row }) => (
       <div className="font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-[12px]">
         {row.original.loanNumber}
       </div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const customerCode = `CUST-${row.original.startDate.split('-').reverse().join('/')}/08/11/14`;
      return (
        <div className="flex flex-col">
          <span className="font-bold text-[12px] text-blue-600">{row.original.customerName}</span>
          <span className="text-[10px] text-zinc-400 font-medium font-mono truncate max-w-[120px]">{customerCode}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "principal",
    header: "Disbursed",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-black text-[12px] text-zinc-900 dark:text-zinc-100">
           {row.original.principal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <span className="text-[10px] text-zinc-400 font-medium font-sans italic">
           {row.original.startDate.split('-').reverse().join('/')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "collateralValue",
    header: "Collateral Value",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-black text-[12px] text-zinc-700 dark:text-zinc-300">
          {(row.original.collateralValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <Info className="h-3 w-3 text-zinc-300 cursor-help" />
      </div>
    ),
  },
  {
    accessorKey: "interestRate",
    header: "Interest Rate",
    cell: ({ row }) => (
      <span className="font-bold text-[12px] text-zinc-600">
        {row.original.interestRate.toFixed(2)}%
      </span>
    ),
  },
  {
    accessorKey: "daysOverdue",
    header: "Days Overdue",
    cell: ({ row }) => {
      const overdue = row.original.daysOverdue || 0;
      return overdue > 0 ? (
        <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 uppercase text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-md">
          {overdue} DAYS
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 uppercase text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-md">
          CURRENT
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center justify-between w-24 px-2 py-1.5 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 shadow-sm transition-colors hover:border-zinc-300 group cursor-pointer">
        <span className="text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-400">{row.original.status}</span>
        <MoreHorizontal className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-600" />
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-lg border-blue-100 bg-blue-50/50 hover:bg-blue-100 text-blue-600 transition-all active:scale-95"
          onClick={() => actions.onView(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-lg border-amber-100 bg-amber-50/50 hover:bg-amber-100 text-amber-600 transition-all active:scale-95"
          onClick={() => actions.onEdit(row.original)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-lg border-rose-100 bg-rose-50/50 hover:bg-rose-100 text-rose-600 transition-all active:scale-95"
          onClick={() => actions.onDelete(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export const getLoanActions = (
  onView: (loan: Loan) => void,
  onEdit: (loan: Loan) => void,
  onDelete: (loan: Loan) => void = (loan) => console.log("Delete", loan)
) => ({
  onView,
  onEdit,
  onDelete,
});

export const getRequestedLoanActions = (
  onApprove: (loan: Loan) => void,
  onReject: (loan: Loan) => void
) => ({
  onView: onApprove, // Map approve to view for convenience or keep as is
  onEdit: onApprove,
  onDelete: onReject,
});

export const requestedLoanColumns = (actions: {
  onView: (loan: Loan) => void;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
}): ColumnDef<Loan>[] => {
  const base = loanColumns(actions).filter(c => (c as any).id !== "actions" && (c as any).accessorKey !== "status");
  return [
    ...base,
    {
      accessorKey: "startDate",
      header: "Applied Date",
      cell: ({ row }) => (
        <span className="text-[11px] font-bold text-zinc-500">{row.original.startDate}</span>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100">Approve</Button>
           <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase text-rose-600 border-rose-100 bg-rose-50 hover:bg-rose-100">Reject</Button>
        </div>
      )
    }
  ];
};

export const overdueLoanColumns = (actions: {
  onView: (loan: Loan) => void;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
}): ColumnDef<Loan>[] => {
  const base = loanColumns(actions).filter(c => (c as any).id !== "actions" && (c as any).accessorKey !== "status");
  return [
    ...base,
    {
      accessorKey: "daysOverdue",
      header: "Overdue Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 uppercase text-[9px] font-black px-2 py-0.5">
          {row.original.daysOverdue} DAYS LATE
        </Badge>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
           <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-lg border-blue-100 bg-blue-50 text-blue-600"
            onClick={() => actions.onView(row.original)}
           >
            <Eye className="h-4 w-4" />
           </Button>
           <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[10px] font-black uppercase text-rose-600 border-rose-100 bg-rose-50 hover:bg-rose-100"
           >
            Settle Now
           </Button>
        </div>
      )
    }
  ];
};

export const rejectedLoanColumns = (actions: {
  onView: (loan: Loan) => void;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
}): ColumnDef<Loan>[] => {
  const base = loanColumns(actions).filter(c => (c as any).id !== "actions" && (c as any).accessorKey !== "status");
  return [
    ...base,
    {
      accessorKey: "reason",
      header: "Reason",
      cell: () => <span className="text-[11px] text-zinc-500 italic">Insufficient collateral coverage</span>
    }
  ];
};
