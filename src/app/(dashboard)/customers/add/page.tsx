import React from "react";
import { AddCustomerForm } from "@/components/customers/add-customer-form";

export const metadata = {
  title: "Add New Customer | ALMS",
  description: "Manual registration of new MoneyTap ecosystem members.",
};

export default function AddCustomerPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <AddCustomerForm />
    </div>
  );
}
