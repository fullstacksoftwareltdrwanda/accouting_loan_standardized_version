"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "@/types/expense";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/currency";
import { DataTableAction } from "@/types/common";
import { RowActions } from "@/components/table/row-actions";
import { Laptop, Sofa, Truck, Building2, Edit, Trash, BarChart3 } from "lucide-react";

export const getAssetActions = (
  onEdit: (asset: Asset) => void,
  onDeactivate: (asset: Asset) => void
): DataTableAction<Asset>[] => [
  {
    label: "Edit Details",
    icon: Edit,
    onClick: onEdit,
  },
  {
    label: "View Valuation",
    icon: BarChart3,
    onClick: (asset) => console.log("Valuation history for", asset),
  },
  {
    label: "Dispose Asset",
    icon: Trash,
    variant: "danger",
    onClick: onDeactivate,
  },
];

export const assetColumns = (
  actions: DataTableAction<Asset>[]
): ColumnDef<Asset>[] => [
  {
    accessorKey: "name",
    header: "Asset",
    cell: ({ row }) => {
      const asset = row.original;
      const icons: Record<Asset["category"], any> = {
        Electronics: Laptop,
        Furniture: Sofa,
        Vehicles: Truck,
        Property: Building2,
      };
      const Icon = icons[asset.category] || Laptop;

      return (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
            <Icon className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-zinc-900 dark:text-zinc-50">{asset.name}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">SN: {asset.serialNumber || "N/A"}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "purchaseDate",
    header: "Acquired",
    cell: ({ row }) => <span className="font-sans text-xs text-zinc-500 font-bold">{row.getValue("purchaseDate")}</span>,
  },
  {
    accessorKey: "value",
    header: () => <div className="text-right">Purchase Price</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono font-black text-zinc-500">
        {formatCurrency(row.getValue("value"))}
      </div>
    ),
  },
  {
    accessorKey: "currentValue",
    header: () => <div className="text-right">Current Value</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono font-black text-indigo-600">
        {formatCurrency(row.getValue("currentValue"))}
      </div>
    ),
  },
  {
    accessorKey: "depreciation",
    header: () => <div className="text-center">Dep. Rate</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-xs font-black text-rose-600">-{row.original.depreciationRate}%</span>
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
