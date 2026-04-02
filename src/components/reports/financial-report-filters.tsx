"use client";

import React from "react";
import { Calendar, Filter, Download, Printer, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinancialReportFiltersProps {
  startDate: string;
  endDate: string;
  onFilter: () => void;
  onQuickSelect: (type: "today" | "month" | "year") => void;
}

export const FinancialReportFilters = ({ startDate, endDate, onFilter, onQuickSelect }: FinancialReportFiltersProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-zinc-100">
        <Calendar className="h-4 w-4 text-zinc-500" />
        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-600">Report Period</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 items-end gap-6">
        <div className="space-y-1.5 md:col-span-1 lg:col-span-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Start Date</Label>
          <Input 
            type="date" 
            defaultValue={startDate}
            className="h-10 border-zinc-200 text-sm"
          />
        </div>
        
        <div className="space-y-1.5 md:col-span-1 lg:col-span-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">End Date</Label>
          <Input 
            type="date" 
            defaultValue={endDate}
            className="h-10 border-zinc-200 text-sm"
          />
        </div>

        <div className="pb-0.5">
          <Button 
            onClick={onFilter}
            className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-black px-6 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Filter className="mr-2 h-4 w-4" />
            Apply Filter
          </Button>
        </div>

        <div className="md:col-span-2 lg:col-span-2 space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Quick Select:</Label>
            <div className="flex items-center gap-2">
                {["Today", "This Month", "This Year"].map((type) => (
                    <button 
                        key={type}
                        onClick={() => onQuickSelect(type.toLowerCase().replace("this ", "") as any)}
                        className="px-3 py-1.5 rounded border border-zinc-200 text-[11px] font-bold text-zinc-500 hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100 transition-colors"
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export const ReportToolbar = () => (
    <div className="flex items-center gap-2 self-end">
        <Button variant="outline" className="h-8 text-[11px] font-bold border-blue-200 text-blue-600 hover:bg-blue-50">
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            Print
        </Button>
        <Button variant="outline" className="h-8 text-[11px] font-bold border-emerald-200 text-emerald-600 hover:bg-emerald-50">
            <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />
            Export to Excel
        </Button>
        <Button variant="outline" className="h-8 text-[11px] font-bold border-rose-200 text-rose-600 hover:bg-rose-50">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Export to PDF
        </Button>
    </div>
);
