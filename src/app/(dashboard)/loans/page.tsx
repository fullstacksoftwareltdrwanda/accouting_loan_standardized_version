import React from "react";
import { LoanList } from "@/components/loans/loan-list";

export const metadata = {
  title: "Loan Portfolio | ALMS",
  description: "Track and manage your commercial and personal loan portfolio.",
};

export default function LoansPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <LoanList />
    </div>
  );
}
