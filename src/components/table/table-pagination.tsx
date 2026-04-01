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
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-zinc-500 font-sans">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        {showPageSize && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-extrabold uppercase tracking-widest text-zinc-400">Rows per page</p>
            <select
              value={`${table.getState().pagination.pageSize}`}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 w-[70px] rounded-lg border border-zinc-200 bg-white px-2 py-0.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:bg-zinc-900/50 dark:border-zinc-800"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex rounded-lg"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex rounded-lg"
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
