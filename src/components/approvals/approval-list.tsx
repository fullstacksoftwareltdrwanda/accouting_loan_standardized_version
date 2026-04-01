"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Terminal } from "lucide-react";
import { ApprovalRequest } from "@/types/approval";
import { getPendingRequests, processRequest } from "@/services/mock/approval.service";
import { DataTable } from "@/components/table/data-table";
import { approvalColumns, getApprovalActions } from "./approval-columns";

export function ApprovalList() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load requests
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPendingRequests();
        setRequests(data);
      } catch (error) {
        console.error("Failed to load requests", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Quick Decision Handler
  const handleDecision = async (id: string, action: "approve" | "reject") => {
    try {
      const success = await processRequest(id, action);
      if (success) {
        setRequests((prev) => 
          prev.map((req) => 
            req.id === id ? { ...req, status: action === "approve" ? "active" : "inactive" } : req
          )
        );
      }
    } catch (error) {
      console.error("Decision failed", error);
    }
  };

  const actions = getApprovalActions(
    (req) => handleDecision(req.id, "approve"),
    (req) => handleDecision(req.id, "reject")
  );

  const columns = approvalColumns(
    actions, 
    (id) => handleDecision(id, "approve"),
    (id) => handleDecision(id, "reject")
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            Approval Center
          </h2>
          <p className="text-zinc-500 font-sans dark:text-zinc-400">
            Review and process pending applications, expenditures, and ledger adjustments.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-400">
           <Terminal className="h-4 w-4" />
           Operational Queue: {requests.filter(r => r.status === "pending").length} Pending
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800">
        <DataTable 
          columns={columns} 
          data={requests} 
          isLoading={isLoading} 
          filterColumn="title"
          filterPlaceholder="Search requests by title or requester..."
        />
      </div>
    </div>
  );
}
