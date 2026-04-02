"use client";

import React from "react";
import { IncomeStatementReport } from "@/types/report";
import { ReportHeaderBanner } from "./report-banner";
import { formatCurrency } from "@/lib/currency";
import { ReportToolbar } from "./financial-report-filters";
import { TrendingUp, TrendingDown, Info, Users, ArrowUpRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface IncomeStatementViewProps {
  report: IncomeStatementReport;
}

export const IncomeStatementView = ({ report }: IncomeStatementViewProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-sm" />
          <h3 className="text-sm font-black uppercase tracking-wider">Income Statement</h3>
        </div>
        <ReportToolbar />
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <ReportHeaderBanner 
          title="Income Statement" 
          periodLabel={`Period: ${report.period}`} 
        />

        <div className="p-0">
            {/* NOTE BANNER (Top) */}
            <div className="bg-cyan-50/50 border-y border-cyan-100/50 px-6 py-3 flex items-start gap-3">
                <Info className="h-4 w-4 text-cyan-600 mt-0.5" />
                <p className="text-[11px] text-cyan-700 font-medium leading-relaxed">
                    <span className="font-black uppercase mr-1">Note:</span>
                    "Paid in Period" sums amounts from the <span className="font-bold border-b border-cyan-300">loan_payments</span> table for the selected range. 
                    "Outstanding Balance" shows current active loan balances.
                </p>
            </div>

            {/* REVENUE SECTION */}
            <div className="space-y-0 border-b border-zinc-200">
                <div className="bg-[#2563eb] px-5 py-3.5 text-white flex items-center justify-between border-b border-blue-700/30">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5" />
                        <span className="text-[12px] font-black uppercase tracking-[0.1em]">Revenue</span>
                    </div>
                    <span className="font-mono text-lg font-black">{formatCurrency(0)}</span>
                </div>
                
                {report.revenue.map((section, sidx) => (
                    <div key={sidx} className="border-b border-zinc-100 last:border-b-0">
                        <div className="bg-[#f1f5f9] px-6 py-2 border-b border-zinc-200">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#2563eb]">{section.title}</span>
                        </div>
                        <div className="divide-y divide-zinc-50">
                            {section.items.map((item, iidx) => (
                                <div key={iidx} className="flex items-center justify-between px-8 py-3 text-[11px] hover:bg-zinc-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-400 font-mono font-bold w-12">{item.code}</span>
                                        <span className="font-bold text-zinc-700">{item.name}</span>
                                    </div>
                                    <span className="font-mono font-bold text-blue-600">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-blue-50/50 px-8 py-2.5 flex items-center justify-between border-t border-blue-100/50">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">{section.title} Total</span>
                            <span className="font-mono font-black text-blue-700 text-[12px]">{formatCurrency(section.total)}</span>
                        </div>
                    </div>
                ))}

                {/* REVENUE ANALYSIS BY CUSTOMER ROW */}
                <div className="bg-zinc-50/10 px-6 py-4 flex items-center justify-between border-t border-zinc-100">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Revenue Analysis by Customer</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">View Details</span>
                        <Switch />
                    </div>
                </div>

                <div className="bg-[#2563eb] px-6 py-4 text-white flex items-center justify-between font-black uppercase tracking-widest text-[14px]">
                    <span>TOTAL REVENUE</span>
                    <span className="font-mono text-xl">{formatCurrency(0)}</span>
                </div>
            </div>

            {/* EXPENSES SECTION */}
            <div className="space-y-0 border-b border-zinc-200">
                <div className="bg-[#c2410c] px-5 py-3.5 text-white flex items-center gap-3 border-b border-orange-700/30">
                    <TrendingDown className="h-5 w-5" />
                    <span className="text-[12px] font-black uppercase tracking-[0.1em]">Expenses</span>
                </div>
                
                {report.expenses.map((section, sidx) => (
                    <div key={sidx}>
                        <div className="bg-[#f1f5f9] px-6 py-2 border-b border-zinc-200 flex justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">{section.title}</span>
                            <span className="text-[10px] font-black text-zinc-400">AMOUNT</span>
                        </div>
                        <div className="divide-y divide-zinc-50">
                            {section.items.map((item, iidx) => (
                                <div key={iidx} className="flex items-center justify-between px-8 py-3 text-[11px] hover:bg-zinc-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-400 font-mono font-bold w-12">{item.code}</span>
                                        <span className="font-bold text-zinc-700">{item.name}</span>
                                    </div>
                                    <span className="font-mono font-bold text-orange-600">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-orange-50/50 px-8 py-2.5 flex items-center justify-between border-t border-orange-100/50">
                            <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">{section.title} Total</span>
                            <span className="font-mono font-black text-orange-700 text-[12px]">{formatCurrency(0)}</span>
                        </div>
                    </div>
                ))}

                <div className="bg-[#ea580c] px-6 py-4 text-white flex items-center justify-between font-black uppercase tracking-widest text-[14px]">
                    <span>TOTAL EXPENSES</span>
                    <span className="font-mono text-xl">{formatCurrency(0)}</span>
                </div>
            </div>

            {/* NET INCOME SUMMARY SECTION */}
            <div className="bg-[#059669] px-6 py-4 text-white flex items-center justify-between font-black uppercase tracking-widest text-[14px] border-b border-emerald-500">
                <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                        <ArrowUpRight className="h-5 w-5" />
                        NET INCOME (PROFIT)
                    </span>
                    <span className="text-[10px] opacity-70 ml-7 lowercase">0.00% Profit Margin</span>
                </div>
                <span className="font-mono text-2xl">0</span>
            </div>

            <div className="p-12 bg-zinc-50/30 space-y-10">
                <div className="flex items-center gap-3 text-zinc-400 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <h4 className="text-[12px] font-black uppercase tracking-widest">Income Statement Summary</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="bg-white p-7 rounded-2xl border border-zinc-100 shadow-xl shadow-zinc-500/5 text-center space-y-2">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Revenue</p>
                        <p className="text-3xl font-black text-blue-600 tracking-tighter">0</p>
                    </div>
                    <div className="bg-white p-7 rounded-2xl border border-zinc-100 shadow-xl shadow-zinc-500/5 text-center space-y-2">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Expenses</p>
                        <p className="text-3xl font-black text-orange-500 tracking-tighter">0</p>
                    </div>
                </div>

                <div className="bg-emerald-600 rounded-[2rem] p-12 flex flex-col items-center justify-center space-y-4 text-center text-white shadow-2xl shadow-emerald-600/20 max-w-4xl mx-auto animate-in zoom-in-95 duration-700">
                    <div className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Profitability Overview</span>
                    </div>
                    <h5 className="text-2xl font-black tracking-tight">
                        Net Income (Profit)
                    </h5>
                    <p className="text-5xl font-black font-mono tracking-tighter">0</p>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">(0.00% Profit Margin)</p>
                    </div>
                </div>
            </div>

            {/* NOTE BANNER (Bottom) */}
            <div className="bg-cyan-50/50 border-t border-cyan-100/50 px-6 py-4 flex items-center justify-center">
                <p className="text-[10px] text-zinc-400 font-medium">Generated on {new Date().toLocaleDateString()} | Period: 01/04/2026 - 02/04/2026</p>
            </div>
        </div>
      </div>
    </div>
  );
};
