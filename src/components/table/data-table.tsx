"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  Header,
  Row,
  Cell,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TablePagination } from "./table-pagination";
import { TableColumnToggle } from "./table-column-toggle";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  filterColumn?: string;
  filterPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  filterColumn,
  filterPlaceholder = "Filter records...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        {filterColumn && (
          <div className="flex-1 max-w-sm">
            <Input
              placeholder={filterPlaceholder}
              value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(filterColumn)?.setFilterValue(event.target.value)
              }
              className="h-9 rounded-xl border-zinc-200 focus-visible:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/50"
            />
          </div>
        )}
        <TableColumnToggle table={table} />
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-950/40">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-white/[0.02]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-zinc-100 dark:border-zinc-800">
                {headerGroup.headers.map((header: Header<TData, unknown>) => {
                  return (
                    <TableHead key={header.id} className="h-12 text-xs font-black uppercase tracking-widest text-zinc-400">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 p-0">
                  <LoadingSkeleton rows={5} columns={columns.length} />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<TData>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-zinc-50 hover:bg-zinc-50/50 dark:border-zinc-800/50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />
    </div>
  );
}
