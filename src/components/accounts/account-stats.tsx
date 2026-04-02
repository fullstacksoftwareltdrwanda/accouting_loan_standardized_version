"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import { GLAccount } from "@/types/account";

interface AccountStatsProps {
  accounts: GLAccount[];
}

export const AccountStats = ({ accounts }: AccountStatsProps) => {
  const total = accounts.length;
  const active = accounts.filter((acc) => acc.status === "active").length;
  const inactive = total - active;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 bg-cyan-500 px-4 py-2.5 text-white">
        <LayoutGrid className="h-4 w-4" />
        <h3 className="text-sm font-bold uppercase tracking-wider">Account Statistics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-zinc-100 py-6 text-center gap-y-6 md:gap-y-0">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-blue-600">{total}</p>
          <p className="text-[12px] font-semibold text-zinc-400">Total Accounts</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-emerald-500">{active}</p>
          <p className="text-[12px] font-semibold text-zinc-400">Active</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-rose-500">{inactive}</p>
          <p className="text-[12px] font-semibold text-zinc-400">Inactive</p>
        </div>
      </div>
    </div>
  );
};
