"use client";

import React from "react";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  className?: string;
  iconColor: string;
}

const StatCard = ({ label, value, icon: Icon, className, iconColor }: StatCardProps) => (
  <div className={cn(
    "flex-1 bg-white p-8 rounded-[32px] border border-zinc-100 shadow-2xl shadow-zinc-200/40 flex items-center justify-between group hover:border-zinc-200 transition-all duration-500",
    className
  )}>
    <div className="space-y-2">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-500 transition-colors">
        {label}
      </p>
      <h3 className="text-4xl font-black text-[#1a365d] tracking-tighter">
        {value}
      </h3>
    </div>
    <div className={cn(
      "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg",
      iconColor
    )}>
      <Icon className="h-7 w-7 text-white" />
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <StatCard 
        label="Pending Review" 
        value={pendingCount} 
        icon={Clock} 
        iconColor="bg-amber-500"
      />
      <StatCard 
        label="Approved" 
        value={approvedCount} 
        icon={CheckCircle2} 
        iconColor="bg-emerald-500"
      />
      <StatCard 
        label="Rejected" 
        value={rejectedCount} 
        icon={XCircle} 
        iconColor="bg-rose-500"
      />
    </div>
  );
}
