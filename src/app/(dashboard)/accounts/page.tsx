import React from "react";
import { AccountList } from "@/components/accounts/account-list";

export const metadata = {
  title: "Chart of Accounts | ALMS",
  description: "Manage your General Ledger and accounting structure.",
};

export default function AccountsPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <AccountList />
    </div>
  );
}
