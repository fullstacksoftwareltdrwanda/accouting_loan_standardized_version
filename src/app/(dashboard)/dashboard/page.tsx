"use client";

import React, { useState, useEffect } from "react";
import { getDashboardStats } from "@/services/dashboard.service";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { Loader2 } from "lucide-react";
import { DashboardStats } from "@/types/dashboard";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const stats = await getDashboardStats();
        setData(stats);
      } catch (err: any) {
        console.error("Dashboard load failed", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">Warming up your insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-rose-50 text-rose-600 p-6 rounded-[32px] border border-rose-100 max-w-md mx-auto">
          <h3 className="font-black text-xl mb-2">Sync Error</h3>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <DashboardOverview data={data} />
    </div>
  );
}
