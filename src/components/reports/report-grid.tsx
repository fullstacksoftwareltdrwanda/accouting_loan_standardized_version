"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  CheckCircle2, 
  FileSearch,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const REPORT_TYPES = [
  {
    id: "portfolio",
    title: "Loan Portfolio Report",
    description: "Comprehensive overview of all loans with customer details, disbursement info, and status.",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    id: "instalments",
    title: "Instalments Report",
    description: "Detailed breakdown of all loan instalments including payment status and schedules.",
    icon: Calendar,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  },
  {
    id: "customers",
    title: "Customers Report",
    description: "Customer portfolio summary with loan counts and financial metrics.",
    icon: Users,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50"
  },
  {
    id: "overdue",
    title: "Overdue Loans Report",
    description: "Track overdue instalments with days overdue and provision categories.",
    icon: AlertTriangle,
    color: "text-rose-500",
    bgColor: "bg-rose-50"
  },
  {
    id: "payments",
    title: "Payments Report",
    description: "Complete payment history with principal, interest, and fee breakdowns.",
    icon: History,
    color: "text-amber-500",
    bgColor: "bg-amber-50"
  },
  {
    id: "provisions",
    title: "Provisions Report",
    description: "Loan loss provision calculations based on exposure and overdue periods.",
    icon: ShieldCheck,
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    id: "summary",
    title: "Portfolio Summary Report",
    description: "High-level portfolio metrics and key performance indicators.",
    icon: TrendingUp,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50"
  }
];

export function ReportGrid() {
  const [selectedReport, setSelectedReport] = useState("portfolio");

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tighter text-[#1a365d] dark:text-blue-400 uppercase">
          Reports Center
        </h2>
        <p className="text-[13px] text-zinc-500 font-medium italic">
          Generate and download excel reports with custom timeframes
        </p>
      </div>

      {/* Filter Section */}
      <div className="p-8 bg-white rounded-[40px] border border-zinc-200 shadow-2xl shadow-zinc-200/50 dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none">
        <div className="flex items-center gap-2 mb-6">
           <FileSearch className="h-4 w-4 text-blue-500" />
           <span className="text-[11px] font-black uppercase tracking-widest text-[#1a365d]">Report Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Report Type</label>
              <Select defaultValue="portfolio">
                <SelectTrigger className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/50">
                  <SelectValue placeholder="Select Report" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="portfolio">Loan Portfolio</SelectItem>
                   <SelectItem value="instalments">Instalments</SelectItem>
                </SelectContent>
              </Select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Start Date</label>
              <Input type="date" className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/50" defaultValue="2025-01-01" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">End Date</label>
              <Input type="date" className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/50" defaultValue="2026-04-02" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Customer</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/50">
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="all">All Customers</SelectItem>
                </SelectContent>
              </Select>
           </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Quick Month Selection</label>
                <Input type="month" className="h-12 w-64 rounded-2xl border-zinc-200 bg-zinc-50/50" defaultValue="2025-01" />
              </div>
              <Button className="h-12 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[11px] tracking-widest gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                <Download className="h-4 w-4" />
                Download Excel Report
              </Button>
           </div>

           <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-2">Quick select:</span>
              {["Today", "This Week", "This Month", "This Quarter", "This Year", "Last Month", "Last Quarter", "Last Year"].map(label => (
                <button 
                  key={label}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-blue-300 hover:text-blue-600 transition-colors bg-white shadow-sm active:scale-95"
                >
                  {label}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="space-y-6">
        <p className="text-[11px] text-zinc-400 font-bold italic ml-2">Click a card to select that report type, then download above</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORT_TYPES.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={cn(
                "group relative p-8 rounded-[32px] border transition-all duration-300 text-left hover:shadow-xl active:scale-98",
                selectedReport === report.id 
                  ? "bg-emerald-50/30 border-emerald-500 shadow-xl shadow-emerald-500/5" 
                  : "bg-white border-zinc-100 hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800"
              )}
            >
              <div className="flex items-start gap-4">
                 <div className={cn(
                   "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3",
                   report.bgColor,
                   report.color
                 )}>
                   <report.icon className="h-6 w-6" />
                 </div>
                 
                 <div className="space-y-2 pr-4">
                    <h4 className="text-[14px] font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">{report.title}</h4>
                    <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">
                      {report.description}
                    </p>
                 </div>
                 
                 {selectedReport === report.id && (
                   <div className="absolute top-6 right-6 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                     <CheckCircle2 className="h-3 w-3 text-white" />
                   </div>
                 )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
