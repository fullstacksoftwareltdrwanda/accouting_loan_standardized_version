"use client";

import React from "react";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApprovalStatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const ApprovalStatCard = ({ label, value, icon: Icon, color }: ApprovalStatCardProps) => (
  <div className="bg-white p-5 rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] flex items-center gap-4 transition-all hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5">
    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", color)}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
        {label}
      </p>
      <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
        {value}
      </h3>
    </div>
  </div>
);

export function ApprovalStats({ 
  pendingCount = 0, 
  approvedCount = 0, 
  rejectedCount = 0 
}: { 
  pendingCount?: number; 
  approvedCount?: number; 
  rejectedCount?: number; 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
      <ApprovalStatCard 
        label="Pending Review" 
        value={pendingCount} 
        icon={Clock} 
        color="bg-amber-50 text-amber-600"
      />
      <ApprovalStatCard 
        label="Approved" 
        value={approvedCount} 
        icon={CheckCircle2} 
        color="bg-emerald-50 text-emerald-600"
      />
      <ApprovalStatCard 
        label="Rejected" 
        value={rejectedCount} 
        icon={XCircle} 
        color="bg-rose-50 text-rose-600"
      />
    </div>
  );
}
