"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "@/types/asset";
import { formatCurrency } from "@/lib/currency";
import { DataTableAction } from "@/types/common";
import { RowActions } from "@/components/table/row-actions";
import { 
  Package, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle,
  History,
  Trash
} from "lucide-react";

export const getAssetActions = (
  onEdit: (asset: Asset) => void,
  onDepreciate: (asset: Asset) => void
): DataTableAction<Asset>[] => [
  {
    label: "Record Depreciation",
    icon: History,
    onClick: onDepreciate,
  },
  {
    label: "Edit Specs",
    icon: Package,
    onClick: onEdit,
  },
  {
    label: "Dispose Asset",
    icon: Trash,
    variant: "danger",
    onClick: (asset) => console.log("Dispose", asset),
  },
];

export const assetColumns = (
  actions: DataTableAction<Asset>[]
): ColumnDef<Asset>[] => [
  {
    accessorKey: "assetNo",
    header: "Asset No",
    cell: ({ row }) => <span className="font-mono text-[11px] font-black text-blue-600 uppercase tracking-tighter">{row.getValue("assetNo")}</span>,
  },
  {
    accessorKey: "item",
    header: "Item",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-zinc-50 border border-zinc-100">
          <Package className="h-4 w-4 text-zinc-400" />
        </div>
        <span className="font-bold text-zinc-900 line-clamp-1">{row.getValue("item")}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">{row.getValue("category")}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-zinc-400">
        <MapPin className="h-3 w-3" />
        <span className="text-[11px] font-medium">{row.getValue("location")}</span>
      </div>
    ),
  },
  {
    accessorKey: "acqDate",
    header: "Acq. Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-zinc-400">
        <Calendar className="h-3 w-3" />
        <span className="text-[11px] font-medium">{row.getValue("acqDate")}</span>
      </div>
    ),
  },
  {
    accessorKey: "value",
    header: () => <div className="text-right">Value</div>,
    cell: ({ row }) => (
      <div className="text-right font-black text-emerald-600">
        {formatCurrency(row.getValue("value"))}
      </div>
    ),
  },
  {
    accessorKey: "accumDep",
    header: () => <div className="text-right">Accum. Dep</div>,
    cell: ({ row }) => (
      <div className="text-right font-black text-amber-500">
        {formatCurrency(row.getValue("accumDep"))}
      </div>
    ),
  },
  {
    accessorKey: "bookValue",
    header: () => <div className="text-right">Book Value</div>,
    cell: ({ row }) => (
      <div className="text-right font-black text-cyan-600">
        {formatCurrency(row.getValue("bookValue"))}
      </div>
    ),
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => {
        const condition = row.getValue("condition") as string;
        const isExcellent = condition === "Excellent" || condition === "Good";
        return (
            <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${isExcellent ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isExcellent ? <ShieldCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                {condition}
            </div>
        );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} actions={actions} />,
  },
];
