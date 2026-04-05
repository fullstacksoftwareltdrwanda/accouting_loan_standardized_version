"use client";

import React, { useState, useEffect } from "react";
import { 
  Table2, 
  Scale, 
  TrendingUp, 
  BarChart,
  Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialReportFilters } from "@/components/reports/financial-report-filters";
import { TrialBalanceView } from "@/components/reports/trial-balance-view";
import { BalanceSheetView } from "@/components/reports/balance-sheet-view";
import { IncomeStatementView } from "@/components/reports/income-statement-view";
import { IncomeAnalysisView } from "@/components/reports/income-analysis-view";
import { 
  getTrialBalance, 
  getBalanceSheet, 
  getIncomeStatement, 
  getIncomeAnalysis 
} from "@/services/report.service";
import { 
  TrialBalanceReport, 
  BalanceSheetReport, 
  IncomeStatementReport,
  IncomeAnalysisReport
} from "@/types/report";

export default function FinancialReportsPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [activeTab, setActiveTab] = useState("trial-balance");
  const [isLoading, setIsLoading] = useState(false);
  
  const [reports, setReports] = useState<{
    trialBalance: TrialBalanceReport | null;
    balanceSheet: BalanceSheetReport | null;
    incomeStatement: IncomeStatementReport | null;
    incomeAnalysis: IncomeAnalysisReport | null;
  }>({
    trialBalance: null,
    balanceSheet: null,
    incomeStatement: null,
    incomeAnalysis: null,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = { from: dateRange.start, asOf: dateRange.end, to: dateRange.end };
      
      if (activeTab === "trial-balance") {
        const data = await getTrialBalance(params);
        setReports(prev => ({ ...prev, trialBalance: data }));
      } else if (activeTab === "balance-sheet") {
        const data = await getBalanceSheet(params);
        setReports(prev => ({ ...prev, balanceSheet: data }));
      } else if (activeTab === "income-statement") {
        const data = await getIncomeStatement(params);
        setReports(prev => ({ ...prev, incomeStatement: data }));
      } else if (activeTab === "income-analysis") {
        const data = await getIncomeAnalysis(params);
        setReports(prev => ({ ...prev, incomeAnalysis: data }));
      }
    } catch (error) {
      console.error("Report fetch failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, dateRange]);

  const handleFilter = () => fetchData();

  const handleQuickSelect = (type: string) => {
    // Logic for quick date selection (This Month, Last Month, etc.)
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
      <Tabs defaultValue="trial-balance" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
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

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-[var(--border-subtle)]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-primary)]" />
            <p className="text-[13px] font-medium text-[var(--text-tertiary)] uppercase tracking-widest">Compiling Ledger Data...</p>
          </div>
        ) : (
          <>
            <TabsContent value="trial-balance" className="mt-0">
              {reports.trialBalance && <TrialBalanceView report={reports.trialBalance} />}
            </TabsContent>
            
            <TabsContent value="balance-sheet" className="mt-0">
              {reports.balanceSheet && <BalanceSheetView report={reports.balanceSheet} />}
            </TabsContent>
            
            <TabsContent value="income-statement" className="mt-0">
              {reports.incomeStatement && <IncomeStatementView report={reports.incomeStatement} />}
            </TabsContent>

            <TabsContent value="income-analysis" className="mt-0">
              {reports.incomeAnalysis && <IncomeAnalysisView report={reports.incomeAnalysis} />}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
