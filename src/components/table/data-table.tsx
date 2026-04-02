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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TablePagination } from "./table-pagination";
import { TableColumnToggle } from "./table-column-toggle";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  filterColumn?: string;
  filterPlaceholder?: string;
  initialColumnVisibility?: VisibilityState;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateAction?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  filterColumn,
  filterPlaceholder = "Filter records...",
  initialColumnVisibility = {},
  emptyStateTitle,
  emptyStateDescription,
  emptyStateAction,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility);
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
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        {filterColumn && (
          <div className="flex-1 max-w-sm relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-disabled)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
            <Input
              placeholder={filterPlaceholder}
              value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(filterColumn)?.setFilterValue(event.target.value)
              }
              className="h-9 pl-9 rounded-xl border-[var(--border-default)] bg-[var(--bg-surface)] text-[13px] focus:ring-2 focus:ring-[var(--accent-primary)]/10 focus:border-[var(--accent-primary)]"
            />
          </div>
        )}
        <TableColumnToggle table={table} />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-white overflow-hidden shadow-[var(--shadow-xs)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-[var(--border-subtle)]">
                {headerGroup.headers.map((header: Header<TData, unknown>) => {
                  return (
                    <TableHead key={header.id} className="h-11 px-4 text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)] bg-[var(--bg-sunken)]">
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
                <TableCell colSpan={columns.length} className="h-20 p-0">
                  <LoadingSkeleton rows={5} columns={columns.length} />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<TData>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                    <TableCell key={cell.id} className="px-4 py-3.5 text-[13px]">
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
                <TableCell colSpan={columns.length} className="h-full text-center">
                  <EmptyState 
                    title={emptyStateTitle}
                    description={emptyStateDescription}
                    action={emptyStateAction}
                  />
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
