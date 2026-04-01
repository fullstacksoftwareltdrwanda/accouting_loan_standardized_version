import React from "react";
import { RejectedLoanList } from "@/components/loans/rejected-loan-list";

export const metadata = {
  title: "Rejected Loans | ALMS",
  description: "History of denied loan applications.",
};

export default function RejectedLoansPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <RejectedLoanList />
    </div>
  );
}
