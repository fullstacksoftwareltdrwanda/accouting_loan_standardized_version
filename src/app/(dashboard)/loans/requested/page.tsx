import React from "react";
import { RequestedLoanList } from "@/components/loans/requested-loan-list";

export const metadata = {
  title: "Requested Loans | ALMS",
  description: "Review pending loan applications.",
};

export default function RequestedLoansPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <RequestedLoanList />
    </div>
  );
}
