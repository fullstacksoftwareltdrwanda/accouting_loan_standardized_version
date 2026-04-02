"use client";

import React from "react";
import { LayoutGrid, CheckCircle2, XCircle } from "lucide-react";
import { GLAccount } from "@/types/account";

interface AccountStatsProps {
  accounts: GLAccount[];
}

export const AccountStats = ({ accounts }: AccountStatsProps) => {
  const total = accounts.length;
  const active = accounts.filter((acc) => acc.status === "active").length;
  const inactive = total - active;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
      <div className="bg-white p-5 rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] flex items-center gap-4 transition-all hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5">
        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <LayoutGrid className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-blue-600 tracking-tight">{total}</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] flex items-center gap-4 transition-all hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5">
        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-emerald-600 tracking-tight">{active}</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] flex items-center gap-4 transition-all hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5">
        <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <XCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Inactive</p>
          <p className="text-2xl font-bold text-rose-600 tracking-tight">{inactive}</p>
        </div>
      </div>
    </div>
  );
};
