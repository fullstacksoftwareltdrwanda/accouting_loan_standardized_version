"use client";

import React, { useState } from "react";
import { 
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
    <div className="flex flex-col space-y-8 pb-12 animate-float-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Financial Reports
        </h1>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          Generate and view financial reports from your General Ledger
        </p>
      </div>

      {/* Filters */}
      <FinancialReportFilters 
        startDate={dateRange.start} 
        endDate={dateRange.end} 
        onFilter={handleFilter} 
        onQuickSelect={handleQuickSelect} 
      />

      {/* Report Tabs */}
      <Tabs defaultValue="trial-balance" className="w-full space-y-6">
        <div className="bg-white p-1 rounded-xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] inline-flex">
          <TabsList className="bg-transparent h-10 gap-1">
            <TabsTrigger 
              value="trial-balance" 
              className="data-[state=active]:bg-[var(--bg-sunken)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-none px-4 text-[12px] font-medium gap-2 transition-all rounded-lg"
            >
              <Table2 className="h-3.5 w-3.5" />
              Trial Balance
            </TabsTrigger>
            <TabsTrigger 
              value="balance-sheet" 
              className="data-[state=active]:bg-[var(--bg-sunken)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-none px-4 text-[12px] font-medium gap-2 transition-all rounded-lg"
            >
              <Scale className="h-3.5 w-3.5" />
              Balance Sheet
            </TabsTrigger>
            <TabsTrigger 
              value="income-statement" 
              className="data-[state=active]:bg-[var(--bg-sunken)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-none px-4 text-[12px] font-medium gap-2 transition-all rounded-lg"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Income Statement
            </TabsTrigger>
            <TabsTrigger 
              value="income-analysis" 
              className="data-[state=active]:bg-[var(--bg-sunken)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-none px-4 text-[12px] font-medium gap-2 transition-all rounded-lg"
            >
              <BarChart className="h-3.5 w-3.5" />
              Income Analysis
            </TabsTrigger>
          </TabsList>
        </div>

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
