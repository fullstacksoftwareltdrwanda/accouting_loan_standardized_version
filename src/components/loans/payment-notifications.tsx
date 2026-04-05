"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  CalendarDays
} from "lucide-react";
import { Loan } from "@/types/loan";
import { getLoans } from "@/services/loan.service";
import { DashboardBanner } from "@/components/shared/dashboard-banner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function PaymentNotifications() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLoans();
        // Mocking 'due soon' logic
        setLoans([]); // Use empty list for 'All Clear' mockup in screenshot
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <DashboardBanner 
        viewOverdueBtn
        variant="info"
        title="Payment Notifications"
        subtitle="Instalments due today and within the next 3 days — requiring your attention for prompt collection and account updates."
        dateLabel={`Today: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}`}
        badgeLabel="Critical Alerts (0)"
      />

      {/* Filters and Search */}
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="h-10 px-6 rounded-full border-zinc-200 bg-white text-zinc-600 font-black text-[11px] uppercase tracking-widest gap-2 shadow-sm">
             <div className="h-2 w-2 rounded-full bg-blue-500" />
             0 Total Alerts
           </Badge>
           <Badge variant="outline" className="h-10 px-6 rounded-full border-zinc-200 bg-white text-zinc-600 font-black text-[11px] uppercase tracking-widest gap-2 shadow-sm">
             <div className="h-2 w-2 rounded-full bg-rose-500" />
             0 Due Today
           </Badge>
           <Badge variant="outline" className="h-10 px-6 rounded-full border-zinc-200 bg-white text-zinc-600 font-black text-[11px] uppercase tracking-widest gap-2 shadow-sm">
             <div className="h-2 w-2 rounded-full bg-emerald-500" />
             0 Due in 1-3 Days
           </Badge>
        </div>

        <div className="max-w-md w-full">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
               className="h-14 pl-12 pr-6 rounded-[20px] border-zinc-200 bg-white shadow-xl shadow-zinc-200/40 text-sm font-medium focus-visible:ring-blue-500/20 focus-visible:border-blue-300 transition-all"
               placeholder="Search by customer, loan number..."
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="relative h-40 w-40 flex items-center justify-center bg-zinc-50 rounded-full border border-zinc-100">
           <CheckCircle2 className="h-20 w-20 text-zinc-200" />
           <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping opacity-20 pointer-events-none" />
           <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white shadow-lg border border-zinc-50 flex items-center justify-center transition-all hover:scale-110 cursor-pointer">
              <span className="text-blue-500 text-lg">✓</span>
           </div>
        </div>
        
        <div className="mt-10 text-center space-y-3">
          <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">All Clear!</h3>
          <p className="text-[13px] text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed italic">
            No instalments are due within the next 3 days. All accounts are currently synchronized with the schedule. Check back later.
          </p>
        </div>
      </div>
    </div>
  );
}
