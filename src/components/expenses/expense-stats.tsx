"use client";

import React from "react";
import { Expense } from "@/types/expense";
import { Receipt, Calendar, Wallet, Users } from "lucide-react";

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

  const stats = [
    { title: "Today's Expenses", value: `Rwf ${todayTotal.toLocaleString()}`, icon: Receipt, color: "text-rose-600 bg-rose-50" },
    { title: "This Month", value: `Rwf ${monthTotal.toLocaleString()}`, icon: Calendar, color: "text-amber-600 bg-amber-50" },
    { title: "All Time Total", value: `Rwf ${grandTotal.toLocaleString()}`, icon: Wallet, color: "text-indigo-600 bg-indigo-50" },
    { title: "Salary Entries", value: salaryEntries.toString(), icon: Users, color: "text-blue-600 bg-blue-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      {stats.map(stat => (
        <div key={stat.title} className="bg-white p-5 rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] transition-all hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <p className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{stat.title}</p>
          </div>
          <p className={`text-xl font-bold tracking-tight ${stat.color.split(' ')[0]}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
