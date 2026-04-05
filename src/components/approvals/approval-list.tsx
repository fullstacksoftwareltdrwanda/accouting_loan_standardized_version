"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Inbox, 
  Search,
  ShieldAlert
} from "lucide-react";
import { ApprovalRequest } from "@/types/approval";
import { getPendingRequests, approveRequest, rejectRequest } from "@/services/approval.service";
import { DataTable } from "@/components/table/data-table";
import { approvalColumns, getApprovalActions } from "./approval-columns";
import { ApprovalStats } from "./approval-stats";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type TabStatus = "pending" | "active" | "inactive" | "all";

export function ApprovalList() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabStatus>("pending");

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

  const handleDecision = async (id: string, action: "approve" | "reject") => {
    try {
      if (action === "approve") {
        await approveRequest(id);
      } else {
        await rejectRequest(id, "Rejected by user");
      }
      
      setRequests((prev) => 
        prev.map((req) => 
          req.id === id ? { 
            ...req, 
            status: action === "approve" ? "active" : "inactive",
            reviewedBy: "Current User" 
          } : req
        )
      );
    } catch (error: any) {
      console.error("Decision failed", error);
      alert(error.message || "Action failed");
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

  const filteredRequests = activeTab === "all" 
    ? requests 
    : requests.filter(r => r.status === activeTab);

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "active").length;
  const rejectedCount = requests.filter(r => r.status === "inactive").length;

  return (
    <div className="space-y-8 animate-float-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Approval Center
        </h1>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          Review and approve pending operational actions including loans, expenditures, and adjustments.
        </p>
      </div>

      {/* Stats */}
      <ApprovalStats 
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
      />

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] overflow-hidden">
        
        {/* Tabs */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-sunken)] rounded-xl">
            {(["pending", "active", "inactive", "all"] as TabStatus[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[12px] font-medium transition-all flex items-center gap-2",
                  activeTab === tab 
                    ? "bg-white text-[var(--text-primary)] shadow-sm" 
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                {tab === "active" ? "Approved" : tab === "inactive" ? "Rejected" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== "all" && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-[10px] font-semibold",
                    activeTab === tab ? "bg-[var(--accent-primary)] text-white" : "bg-[var(--bg-sunken)] text-[var(--text-tertiary)]"
                  )}>
                    {tab === "pending" ? pendingCount : tab === "active" ? approvedCount : rejectedCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-disabled)]" />
            <Input className="h-9 pl-9 w-56 rounded-xl border-[var(--border-default)] text-[13px]" placeholder="Search approvals..." />
          </div>
        </div>
        
        {/* Content */}
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-[var(--bg-sunken)] flex items-center justify-center">
              <Inbox className="h-7 w-7 text-[var(--text-disabled)]" />
            </div>
            <p className="text-[13px] text-[var(--text-tertiary)]">No {activeTab === 'all' ? '' : activeTab} requests found.</p>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredRequests} 
            isLoading={isLoading} 
          />
        )}
      </div>
    </div>
  );
}
