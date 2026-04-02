"use client";

import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  showPageSize?: boolean;
}

export function TablePagination<TData>({
  table,
  showPageSize = true,
}: TablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-1 py-2">
      <div className="flex-1 text-[12px] text-[var(--text-tertiary)]">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>
      <div className="flex items-center gap-4">
        {showPageSize && (
          <div className="flex items-center gap-2">
            <p className="text-[12px] text-[var(--text-tertiary)]">Rows</p>
            <select
              value={`${table.getState().pagination.pageSize}`}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 w-16 rounded-lg border border-[var(--border-default)] bg-white px-2 text-[12px] text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/10 focus:border-[var(--accent-primary)]"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="text-[12px] text-[var(--text-secondary)] font-medium tabular-nums">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex rounded-lg border-[var(--border-default)]"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-[var(--border-default)]"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-[var(--border-default)]"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex rounded-lg border-[var(--border-default)]"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
