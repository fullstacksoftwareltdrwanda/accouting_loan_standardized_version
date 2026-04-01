"use client";

import React, { useState, useEffect } from "react";
import { FolderKanban, SlidersHorizontal } from "lucide-react";
import { Report, ReportCategory } from "@/types/report";
import { getReports } from "@/services/mock/report.service";
import { ReportCard } from "./report-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReportGrid() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ReportCategory | "All">("All");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleUpdate = (updatedReport: Report) => {
    setReports(prev => 
      prev.map(r => r.id === updatedReport.id ? updatedReport : r)
    );
  };

  const filteredReports = activeTab === "All" 
    ? reports 
    : reports.filter(r => r.category === activeTab);

  const tabs: (ReportCategory | "All")[] = ["All", "Financial", "Operational", "Compliance"];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            Report & Export Hub
          </h2>
          <p className="text-zinc-500 font-sans dark:text-zinc-400">
            Generate and download standardized financial and operational data.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 self-start md:self-auto shadow-sm border border-zinc-200 dark:border-zinc-800">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                activeTab === tab 
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400" 
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800" />
           ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-24 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950">
          <FolderKanban className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">No reports found</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Could not find any reports in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {filteredReports.map(report => (
            <ReportCard 
              key={report.id} 
              report={report} 
              onUpdate={handleUpdate} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
