"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  ChevronRight, 
  Home, 
  Table2, 
  Scale, 
  TrendingUp, 
  BarChart 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialReportFilters } from "@/components/reports/financial-report-filters";
import { TrialBalanceView } from "@/components/reports/trial-balance-view";
import { BalanceSheetView } from "@/components/reports/balance-sheet-view";
import { IncomeStatementView } from "@/components/reports/income-statement-view";

// Mock data imports
import { 
  MOCK_TRIAL_BALANCE, 
  MOCK_BALANCE_SHEET, 
  MOCK_INCOME_STATEMENT,
  MOCK_INCOME_ANALYSIS
} from "@/data/mock/financial-reports";

import { IncomeAnalysisView } from "@/components/reports/income-analysis-view";

export default function FinancialReportsPage() {
  const [dateRange, setDateRange] = useState({
    start: "2026-04-01",
    end: "2026-04-02"
  });

  const handleFilter = () => {
    console.log("Filtering reports for", dateRange);
  };

  const handleQuickSelect = (type: string) => {
    console.log("Quick select", type);
  };

  return (
    <div className="flex flex-col space-y-8 mt-1 pb-12">
      {/* Breadcrumbs & Title Area */}
      <div className="space-y-4 px-2">
        <nav className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
          <span className="text-zinc-400 flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
            <Home className="h-4 w-4" />
            Home
          </span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-600 font-semibold">Dashboard</span>
        </nav>

        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-blue-600 uppercase">
            Financial Reports
          </h1>
          <p className="text-[13px] text-zinc-500 font-medium italic">Generate and view financial reports from your General Ledger</p>
        </div>
      </div>

      {/* Filters Section */}
      <FinancialReportFilters 
        startDate={dateRange.start} 
        endDate={dateRange.end} 
        onFilter={handleFilter} 
        onQuickSelect={handleQuickSelect} 
      />

      {/* Reports Tabs Interface */}
      <Tabs defaultValue="trial-balance" className="w-full space-y-6">
        <div className="bg-white p-1 rounded-xl border border-zinc-200 shadow-sm inline-flex">
          <TabsList className="bg-transparent h-10 gap-2">
            <TabsTrigger 
              value="trial-balance" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-6 text-[11px] font-black uppercase tracking-wider gap-2 transition-all active:scale-95"
            >
              <Table2 className="h-3.5 w-3.5" />
              Trial Balance
            </TabsTrigger>
            <TabsTrigger 
              value="balance-sheet" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-6 text-[11px] font-black uppercase tracking-wider gap-2 transition-all active:scale-95"
            >
              <Scale className="h-3.5 w-3.5" />
              Balance Sheet
            </TabsTrigger>
            <TabsTrigger 
              value="income-statement" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-6 text-[11px] font-black uppercase tracking-wider gap-2 transition-all active:scale-95"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Income Statement
            </TabsTrigger>
            <TabsTrigger 
              value="income-analysis" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-6 text-[11px] font-black uppercase tracking-wider gap-2 transition-all active:scale-95"
            >
              <BarChart className="h-3.5 w-3.5" />
              Income Analysis (Customer)
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <TabsContent value="trial-balance" className="mt-0">
          <TrialBalanceView report={MOCK_TRIAL_BALANCE} />
        </TabsContent>
        
        <TabsContent value="balance-sheet" className="mt-0">
          <BalanceSheetView report={MOCK_BALANCE_SHEET} />
        </TabsContent>
        
        <TabsContent value="income-statement" className="mt-0">
          <IncomeStatementView report={MOCK_INCOME_STATEMENT} />
        </TabsContent>

        <TabsContent value="income-analysis" className="mt-0">
          <IncomeAnalysisView report={MOCK_INCOME_ANALYSIS} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
