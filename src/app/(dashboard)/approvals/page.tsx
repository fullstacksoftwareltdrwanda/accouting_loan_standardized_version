import React from "react";
import { ApprovalList } from "@/components/approvals/approval-list";

export const metadata = {
  title: "Approval Center | ALMS",
  description: "Review and process pending operational requests.",
};

export default function ApprovalsPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <ApprovalList />
    </div>
  );
}
