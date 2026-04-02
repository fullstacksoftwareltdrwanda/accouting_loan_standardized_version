"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Users, 
  CheckCircle2, 
  TrendingUp,
  AlertTriangle,
  History,
  ShieldCheck,
  Calendar,
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
    color: "text-blue-600 bg-blue-50"
  },
  {
    id: "instalments",
    title: "Instalments Report",
    description: "Detailed breakdown of all loan instalments including payment status and schedules.",
    icon: Calendar,
    color: "text-emerald-600 bg-emerald-50"
  },
  {
    id: "customers",
    title: "Customers Report",
    description: "Customer portfolio summary with loan counts and financial metrics.",
    icon: Users,
    color: "text-indigo-600 bg-indigo-50"
  },
  {
    id: "overdue",
    title: "Overdue Loans Report",
    description: "Track overdue instalments with days overdue and provision categories.",
    icon: AlertTriangle,
    color: "text-rose-600 bg-rose-50"
  },
  {
    id: "payments",
    title: "Payments Report",
    description: "Complete payment history with principal, interest, and fee breakdowns.",
    icon: History,
    color: "text-amber-600 bg-amber-50"
  },
  {
    id: "provisions",
    title: "Provisions Report",
    description: "Loan loss provision calculations based on exposure and overdue periods.",
    icon: ShieldCheck,
    color: "text-violet-600 bg-violet-50"
  },
  {
    id: "summary",
    title: "Portfolio Summary",
    description: "High-level portfolio metrics and key performance indicators.",
    icon: TrendingUp,
    color: "text-teal-600 bg-teal-50"
  }
];

export function ReportGrid() {
  const [selectedReport, setSelectedReport] = useState("portfolio");

  return (
    <div className="space-y-8 animate-float-in pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Reports Center
        </h1>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          Generate and download excel reports with custom timeframes
        </p>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Report Type</label>
            <Select defaultValue="portfolio">
              <SelectTrigger className="h-10 rounded-xl border-[var(--border-default)]">
                <SelectValue placeholder="Select Report" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portfolio">Loan Portfolio</SelectItem>
                <SelectItem value="instalments">Instalments</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Start Date</label>
            <Input type="date" className="h-10 rounded-xl border-[var(--border-default)]" defaultValue="2025-01-01" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">End Date</label>
            <Input type="date" className="h-10 rounded-xl border-[var(--border-default)]" defaultValue="2026-04-02" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Customer</label>
            <Select defaultValue="all">
              <SelectTrigger className="h-10 rounded-xl border-[var(--border-default)]">
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Quick Month</label>
              <Input type="month" className="h-10 w-56 rounded-xl border-[var(--border-default)]" defaultValue="2025-01" />
            </div>
            <Button className="h-10 px-5 mt-5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl font-medium text-[13px] gap-2 shadow-sm transition-all active:scale-[0.98]">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["Today", "This Week", "This Month", "This Quarter", "This Year"].map(label => (
              <button 
                key={label}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-default)] text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors bg-white active:scale-[0.98]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="space-y-4">
        <p className="text-[12px] text-[var(--text-tertiary)]">Select a report type, then download above</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {REPORT_TYPES.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={cn(
                "group relative p-6 rounded-2xl border transition-all duration-200 text-left hover:shadow-[var(--shadow-md)] active:scale-[0.99]",
                selectedReport === report.id 
                  ? "bg-teal-50/40 border-[var(--accent-primary)] shadow-[var(--shadow-sm)]" 
                  : "bg-white border-[var(--border-subtle)] hover:border-[var(--border-default)]"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                  report.color
                )}>
                  <report.icon className="h-5 w-5" />
                </div>
                
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-[14px] font-semibold text-[var(--text-primary)]">{report.title}</h4>
                  <p className="text-[12px] text-[var(--text-tertiary)] leading-relaxed">
                    {report.description}
                  </p>
                </div>
                
                {selectedReport === report.id && (
                  <div className="h-5 w-5 rounded-full bg-[var(--accent-primary)] flex items-center justify-center shadow-sm animate-in zoom-in duration-200">
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
