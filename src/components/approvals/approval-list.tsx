"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Inbox, 
  Search,
  Filter,
  ShieldAlert
} from "lucide-react";
import { ApprovalRequest, ApprovalType } from "@/types/approval";
import { getPendingRequests, processRequest } from "@/services/mock/approval.service";
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
            req.id === id ? { 
              ...req, 
              status: action === "approve" ? "active" : "inactive",
              reviewedBy: "Director" 
            } : req
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

  const filteredRequests = activeTab === "all" 
    ? requests 
    : requests.filter(r => r.status === activeTab);

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "active").length;
  const rejectedCount = requests.filter(r => r.status === "inactive").length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Area */}
      <div className="space-y-3 px-1">
        <div className="flex items-center gap-3">
           <ShieldAlert className="h-6 w-6 text-blue-600" />
           <h2 className="text-3xl font-black tracking-tighter text-[#1a365d] dark:text-blue-400 uppercase">
             Approval Center
           </h2>
        </div>
        <p className="text-[13px] text-zinc-500 font-medium max-w-2xl leading-relaxed italic">
          Review and approve or reject pending operational actions including loans, expenditures, and ledger adjustments.
        </p>
      </div>

      {/* Stats Area */}
      <ApprovalStats 
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
      />

      {/* Main Table Section */}
      <div className="bg-white rounded-[40px] border border-zinc-200 shadow-2xl shadow-zinc-200/50 overflow-hidden dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none">
        
        {/* Tabs and Controls */}
        <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20 dark:bg-zinc-900/50 dark:border-zinc-800">
           <div className="flex items-center gap-1 p-1 bg-zinc-100/50 rounded-2xl border border-zinc-100">
              {(["pending", "active", "inactive", "all"] as TabStatus[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                    activeTab === tab 
                      ? "bg-white text-blue-600 shadow-sm border border-zinc-100" 
                      : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  {tab === "active" ? "Approved" : tab === "inactive" ? "Rejected" : tab}
                  {tab !== "all" && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-md text-[9px]",
                      activeTab === tab ? "bg-blue-600 text-white" : "bg-zinc-200 text-zinc-600"
                    )}>
                      {tab === "pending" ? pendingCount : tab === "active" ? approvedCount : rejectedCount}
                    </span>
                  )}
                </button>
              ))}
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input className="h-9 pl-9 w-64 rounded-xl border-zinc-200 text-[11px] font-bold" placeholder="Search approvals..." />
              </div>
           </div>
        </div>
        
        {/* Table/Empty State Content */}
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-32 space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-inner">
               <Inbox className="h-10 w-10 text-zinc-200" />
            </div>
            <p className="text-[13px] font-bold text-zinc-400 italic">No {activeTab === 'all' ? '' : activeTab} requests found.</p>
          </div>
        ) : (
          <div className="p-0">
            <DataTable 
              columns={columns} 
              data={filteredRequests} 
              isLoading={isLoading} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
