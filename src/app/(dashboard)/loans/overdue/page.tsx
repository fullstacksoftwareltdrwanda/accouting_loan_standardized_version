import React from "react";
import { OverdueLoanList } from "@/components/loans/overdue-loan-list";

export const metadata = {
  title: "Overdue Collections | ALMS",
  description: "Track and manage overdue loan repayments.",
};

export default function OverdueLoansPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <OverdueLoanList />
    </div>
  );
}
