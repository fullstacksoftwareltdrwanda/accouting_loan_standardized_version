"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableAction } from "@/types/common";

interface RowActionsProps<TData> {
  row: Row<TData>;
  actions: DataTableAction<TData>[];
}

export function RowActions<TData>({
  row,
  actions,
}: RowActionsProps<TData>) {
  if (!actions || actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted rounded-lg"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
        {actions.map((action, index) => {
          const isDisabled = typeof action.disabled === "function" 
            ? action.disabled(row.original) 
            : action.disabled;

          return (
            <React.Fragment key={action.label + index}>
              <DropdownMenuItem
                disabled={isDisabled}
                onClick={() => action.onClick(row.original)}
                className={action.variant === "danger" ? "text-rose-600 focus:text-rose-600 dark:text-rose-400" : ""}
              >
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                <span className="font-bold">{action.label}</span>
              </DropdownMenuItem>
              {index < actions.length - 1 && action.variant === "danger" && (
                <DropdownMenuSeparator />
              )}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
