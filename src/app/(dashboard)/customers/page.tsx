import React from "react";
import { CustomerList } from "@/components/customers/customer-list";

export const metadata = {
  title: "Customers & Borrowers | ALMS",
  description: "Manage borrower profiles and financial summaries.",
};

export default function CustomersPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <CustomerList />
    </div>
  );
}
