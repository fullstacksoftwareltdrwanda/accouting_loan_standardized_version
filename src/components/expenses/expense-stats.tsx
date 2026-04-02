"use client";

import React from "react";
import { Expense } from "@/types/expense";
import { formatCurrency } from "@/lib/currency";

interface ExpenseStatsProps {
  expenses: Expense[];
}

export const ExpenseStats = ({ expenses }: ExpenseStatsProps) => {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().substring(0, 7);

  const todayTotal = expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthTotal = expenses
    .filter((e) => e.date.startsWith(thisMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  const salaryEntries = expenses.filter((e) => e.category === "Salaries").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today */}
      <div className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm space-y-1">
        <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Today's Expenses</p>
        <p className="text-xl font-black text-rose-500">Rwf {todayTotal.toLocaleString()}</p>
        <p className="text-[10px] text-zinc-400 font-medium">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
      </div>

      {/* This Month */}
      <div className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm space-y-1">
        <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">This Month</p>
        <p className="text-xl font-black text-rose-500">Rwf {monthTotal.toLocaleString()}</p>
        <p className="text-[10px] text-zinc-400 font-medium">{new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Total */}
      <div className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm space-y-1">
        <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Total Expenses</p>
        <p className="text-xl font-black text-rose-500">Rwf {grandTotal.toLocaleString()}</p>
        <p className="text-[10px] text-zinc-400 font-medium">All time</p>
      </div>

      {/* Salary Entries - Blue Card */}
      <div className="bg-blue-600 p-5 rounded-xl shadow-lg shadow-blue-500/20 space-y-1 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[12px] font-bold uppercase tracking-wider opacity-80">Salary Entries</p>
          <p className="text-3xl font-black">{salaryEntries}</p>
          <p className="text-[10px] font-medium opacity-70">Salary expense transactions</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
};
