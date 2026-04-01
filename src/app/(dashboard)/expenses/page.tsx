import React from "react";
import { ExpenseList } from "@/components/expenses/expense-list";

export const metadata = {
  title: "Business Expenditures | ALMS",
  description: "Monitor and manage operational costs and fixed/variable expenses.",
};

export default function ExpensesPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <ExpenseList />
    </div>
  );
}
