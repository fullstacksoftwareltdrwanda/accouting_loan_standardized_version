"use client";

import React from "react";
import { 
  Bell, 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DashboardBannerProps {
  variant: "danger" | "info";
  title: string;
  subtitle: string;
  dateLabel?: string;
  badgeLabel?: string;
  onBackClick?: () => void;
  viewOverdueBtn?: boolean;
}

export function DashboardBanner({ 
  variant, 
  title, 
  subtitle, 
  dateLabel, 
  badgeLabel,
  onBackClick,
  viewOverdueBtn
}: DashboardBannerProps) {
  const router = useRouter();
  
  const isDanger = variant === "danger";
  
  return (
    <div className={cn(
      "relative overflow-hidden rounded-[32px] border shadow-2xl transition-all duration-700",
      isDanger 
        ? "bg-[#8b1a1a] border-[#a12323] text-white" 
        : "bg-[#1a365d] border-[#2c5282] text-white"
    )}>
      {/* Decorative Gradient Overlay */}
      <div className={cn(
         "absolute inset-0 opacity-20 pointer-events-none",
         isDanger 
           ? "bg-gradient-to-br from-rose-500 to-transparent" 
           : "bg-gradient-to-br from-blue-500 to-transparent"
      )} />

      {/* Hero Content Section */}
      <div className="relative px-10 py-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-start gap-6">
          <div className={cn(
            "h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3",
            isDanger ? "bg-rose-500/20 text-rose-100" : "bg-blue-500/20 text-blue-100"
          )}>
            {isDanger ? <AlertTriangle className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4 opacity-50" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">MoneyTap Core Ecosystem Terminal</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">{title}</h1>
            <p className="text-[13px] font-medium opacity-80 max-w-lg leading-relaxed">
              {subtitle}
            </p>
            {dateLabel && (
               <div className="flex items-center gap-2 pt-2 opacity-60">
                 <Bell className="h-3.5 w-3.5" />
                 <span className="text-[11px] font-bold italic">{dateLabel}</span>
               </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
           {viewOverdueBtn && (
             <Button 
               onClick={() => router.push("/approvals")} // Adjust route if needed
               className="h-12 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[11px] tracking-widest gap-2 shadow-lg shadow-rose-900/40"
             >
               <AlertTriangle className="h-4 w-4" />
               View Overdue
             </Button>
           )}
           <Button 
             variant="ghost" 
             className="h-12 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[11px] tracking-widest gap-2 border border-white/10"
           >
             <Bell className="h-4 w-4" />
             Notifications
           </Button>
           <Button 
             onClick={onBackClick || (() => router.push("/loans"))}
             className="h-12 px-8 rounded-2xl bg-white text-[#1a365d] hover:bg-zinc-100 font-extrabold uppercase text-[11px] tracking-widest gap-3 shadow-xl transition-all active:scale-95"
           >
             <ArrowLeft className="h-4 w-4" />
             Back to Loans
           </Button>
        </div>
      </div>

      {/* Progress/Secondary Badge Section */}
      {badgeLabel && (
        <div className="px-10 pb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/5 backdrop-blur-md">
            <div className={cn("h-2 w-2 rounded-full animate-pulse", isDanger ? "bg-rose-400" : "bg-blue-400")} />
            <span className="text-[11px] font-black uppercase tracking-widest text-white/90">{badgeLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}
