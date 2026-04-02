"use client";

import React from "react";
import { IncomeAnalysisReport } from "@/types/report";
import { ReportHeaderBanner } from "./report-banner";
import { formatCurrency } from "@/lib/currency";
import { ReportToolbar } from "./financial-report-filters";

interface IncomeAnalysisViewProps {
  report: IncomeAnalysisReport;
}

export const IncomeAnalysisView = ({ report }: IncomeAnalysisViewProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-sm" />
          <h3 className="text-sm font-black uppercase tracking-wider">Income Analysis (Customer)</h3>
        </div>
        <ReportToolbar />
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden pb-10">
        <ReportHeaderBanner 
          title="Income Analysis (By Customer)" 
          periodLabel={`Period: ${report.period}`} 
        />

        <div className="overflow-x-auto px-4">
          <table className="w-full text-left border-collapse border border-zinc-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#f8fafc] text-[10px] font-black uppercase tracking-widest text-[#64748b] border-b border-zinc-200">
                <th className="px-6 py-4 border-r border-zinc-200 w-[200px]" rowSpan={2}>Customer / Loan</th>
                <th colSpan={4} className="px-4 py-4 border-r border-zinc-200 text-center bg-blue-50/40 text-blue-600 border-b-2 border-b-blue-200/50">Paid in Selected Period</th>
                <th colSpan={3} className="px-4 py-4 border-r border-zinc-200 text-center bg-emerald-50/40 text-emerald-600 border-b-2 border-b-emerald-200/50">All-Time Totals</th>
                <th colSpan={2} className="px-4 py-4 text-center bg-rose-50/40 text-rose-600 border-b-2 border-b-rose-200/50">Remaining (Left)</th>
              </tr>
              <tr className="bg-[#f1f5f9] text-[9px] font-extrabold uppercase text-zinc-500 border-b border-zinc-200">
                <th className="px-2 py-2 border-r border-zinc-200 text-center w-[100px]">Interest</th>
                <th className="px-2 py-2 border-r border-zinc-200 text-center w-[100px]">Periodic Mgmt</th>
                <th className="px-2 py-2 border-r border-zinc-200 text-center w-[100px]">Disb. Mgmt Fee</th>
                <th className="px-2 py-2 border-r border-zinc-200 text-center w-[100px]">Penalties</th>
                
                <th className="px-2 py-2 border-r border-zinc-200 text-center w-[100px]">Total Interest</th>
                <th className="px-2 py-2 border-r border-zinc-200 text-center w-[100px]">Total Periodic Mgmt</th>
                <th className="px-2 py-2 border-r border-zinc-200 text-center w-[100px]">Total Disb. Fee</th>
                
                <th className="px-2 py-2 border-r border-zinc-200 text-center w-[100px]">Interest Left</th>
                <th className="px-2 py-2 text-center w-[100px]">Mgmt Fee Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-sans">
              {report.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/80 transition-colors text-[11px] font-medium text-zinc-600">
                  <td className="px-6 py-3 border-r border-zinc-100">
                    <div className="flex flex-col">
                        <span className="font-black text-zinc-800">{item.customerName}</span>
                        <span className="text-[9px] text-zinc-400 font-mono">{item.loanNumber}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 border-r border-zinc-100 text-right font-mono font-bold text-zinc-600">{formatCurrency(item.period.interest)}</td>
                  <td className="px-2 py-3 border-r border-zinc-100 text-right font-mono font-bold text-zinc-600">{formatCurrency(item.period.periodicMgmt)}</td>
                  <td className="px-2 py-3 border-r border-zinc-100 text-right font-mono font-bold text-zinc-400">—</td>
                  <td className="px-2 py-3 border-r border-zinc-100 text-right font-mono font-bold text-zinc-600">{formatCurrency(item.period.penalties)}</td>
                  
                  <td className="px-2 py-3 border-r border-zinc-100 text-right font-mono font-bold text-zinc-600">{formatCurrency(item.allTime.totalInterest)}</td>
                  <td className="px-2 py-3 border-r border-zinc-100 text-right font-mono font-bold text-zinc-600">{formatCurrency(item.allTime.totalPeriodicMgmt)}</td>
                  <td className="px-2 py-3 border-r border-zinc-100 text-right font-mono font-bold text-zinc-800">{formatCurrency(item.allTime.totalDisbFee)}</td>
                  
                  <td className="px-2 py-3 border-r border-zinc-100 text-right font-mono font-black text-rose-500">{formatCurrency(item.remaining.interestLeft)}</td>
                  <td className="px-2 py-3 text-right font-mono font-black text-rose-500">{formatCurrency(item.remaining.mgmtFeeLeft)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
                <tr className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-900 border-t-2 border-zinc-200">
                    <td className="px-6 py-3 border-r border-zinc-200">TOTALS</td>
                    <td className="px-2 py-3 border-r border-zinc-200 text-right font-mono">{formatCurrency(report.totals.periodInterest)}</td>
                    <td className="px-2 py-3 border-r border-zinc-200 text-right font-mono">{formatCurrency(report.totals.periodPeriodicMgmt)}</td>
                    <td className="px-2 py-3 border-r border-zinc-200 text-right font-mono">{formatCurrency(report.totals.periodDisbMgmtFee)}</td>
                    <td className="px-2 py-3 border-r border-zinc-200 text-right font-mono">{formatCurrency(report.totals.periodPenalties)}</td>
                    
                    <td className="px-2 py-3 border-r border-zinc-200 text-right font-mono">{formatCurrency(report.totals.allTimeInterest)}</td>
                    <td className="px-2 py-3 border-r border-zinc-200 text-right font-mono">{formatCurrency(report.totals.allTimePeriodicMgmt)}</td>
                    <td className="px-2 py-3 border-r border-zinc-200 text-right font-mono">{formatCurrency(report.totals.allTimeDisbFee)}</td>
                    
                    <td className="px-2 py-3 border-r border-zinc-200 text-right font-mono text-rose-600">{formatCurrency(report.totals.remainingInterest)}</td>
                    <td className="px-2 py-3 text-right font-mono text-rose-600">{formatCurrency(report.totals.remainingMgmtFee)}</td>
                </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="flex justify-center pb-8 opacity-40">
        <p className="text-[11px] font-medium text-zinc-500">Generated on {new Date().toLocaleTimeString()} | Period: 01/04/2026 - 02/04/2026</p>
      </div>
    </div>
  );
};
