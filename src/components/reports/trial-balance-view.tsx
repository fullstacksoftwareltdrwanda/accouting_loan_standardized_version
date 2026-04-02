"use client";

import React from "react";
import { TrialBalanceReport, TrialBalanceItem } from "@/types/report";
import { ReportHeaderBanner } from "./report-banner";
import { formatCurrency } from "@/lib/currency";
import { ReportToolbar } from "./financial-report-filters";

interface TrialBalanceViewProps {
  report: TrialBalanceReport;
}

export const TrialBalanceView = ({ report }: TrialBalanceViewProps) => {
  // Grouping items by their 'group' property
  const groupedItems = report.items.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, TrialBalanceItem[]>);

  // Helper to calculate totals for a group
  const calculateGroupTotal = (items: TrialBalanceItem[]) => {
    return items.reduce((acc, item) => ({
      initial: acc.initial + item.openingBalance.initial,
      openingDebit: acc.openingDebit + item.openingBalance.debit,
      openingCredit: acc.openingCredit + item.openingBalance.credit,
      movementsDebit: acc.movementsDebit + item.movements.debit,
      movementsCredit: acc.movementsCredit + item.movements.credit,
      balance: acc.balance + item.closingBalance.balance,
      final: acc.final + item.closingBalance.final,
    }), { initial: 0, openingDebit: 0, openingCredit: 0, movementsDebit: 0, movementsCredit: 0, balance: 0, final: 0 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="h-2 w-2 rounded-full bg-blue-600 shadow-sm" />
          <h3 className="text-sm font-black uppercase tracking-wider">Trial Balance Report</h3>
        </div>
        <ReportToolbar />
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden pb-10">
        <ReportHeaderBanner 
          title="Trial Balance" 
          periodLabel={`Period: ${report.period}`} 
        />

        <div className="overflow-x-auto px-4">
          <table className="w-full text-left border-collapse border border-zinc-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#f8fafc] text-[10px] font-black uppercase tracking-widest text-[#64748b] border-b border-zinc-200">
                <th className="px-6 py-4 border-r border-zinc-200 w-[140px]">Group</th>
                <th className="px-4 py-4 border-r border-zinc-200 text-center w-[100px]">Account Code</th>
                <th className="px-4 py-4 border-r border-zinc-200 min-w-[200px]">Account Name</th>
                <th colSpan={3} className="px-4 py-4 border-r border-zinc-200 text-center bg-blue-50/40 text-blue-600 border-b-2 border-b-blue-200/50">Opening Balance</th>
                <th colSpan={2} className="px-4 py-4 border-r border-zinc-200 text-center bg-zinc-50/50 text-zinc-600 border-b-2 border-b-zinc-200/50">Movements</th>
                <th colSpan={2} className="px-4 py-4 text-center bg-emerald-50/40 text-emerald-600 border-b-2 border-b-emerald-200/50">Closing Balance</th>
              </tr>
              <tr className="bg-[#f1f5f9] text-[9px] font-extrabold uppercase text-zinc-500 border-b border-zinc-200">
                <th className="px-6 py-2 border-r border-zinc-200" colSpan={3}></th>
                <th className="px-2 py-2 border-r border-zinc-200 text-right w-[100px]">Initial Balance</th>
                <th className="px-2 py-2 border-r border-zinc-200 text-right w-[100px]">Debit</th>
                <th className="px-2 py-2 border-r border-zinc-200 text-right w-[100px]">Credit</th>
                <th className="px-2 py-2 border-r border-zinc-200 text-right w-[80px]">Debit</th>
                <th className="px-2 py-2 border-r border-zinc-200 text-right w-[80px]">Credit</th>
                <th className="px-2 py-2 border-r border-zinc-200 text-right w-[100px]">Balance</th>
                <th className="px-2 py-2 text-right w-[100px]">Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-sans">
              {Object.entries(groupedItems).map(([groupName, items]) => {
                const groupTotal = calculateGroupTotal(items);
                return (
                    <React.Fragment key={groupName}>
                        {items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-zinc-50/80 transition-colors text-[10.5px] font-medium text-zinc-600 group border-b border-zinc-100 last:border-none">
                                <td className="px-6 py-2.5 border-r border-zinc-200 bg-zinc-50/20 font-bold group-hover:text-blue-600 transition-colors">{item.group}</td>
                                <td className="px-4 py-2.5 border-r border-zinc-200 text-center font-mono font-bold text-zinc-400">{item.accountCode}</td>
                                <td className="px-4 py-2.5 border-r border-zinc-200 font-bold text-zinc-700">{item.accountName}</td>
                                <td className={`px-2 py-2.5 border-r border-zinc-200 text-right font-mono ${item.openingBalance.initial < 0 ? 'text-rose-500' : 'text-zinc-500'}`}>{formatCurrency(item.openingBalance.initial)}</td>
                                <td className="px-2 py-2.5 border-r border-zinc-200 text-right font-mono text-emerald-600">{formatCurrency(item.openingBalance.debit)}</td>
                                <td className="px-2 py-2.5 border-r border-zinc-200 text-right font-mono text-zinc-400">{formatCurrency(item.openingBalance.credit)}</td>
                                <td className="px-2 py-2.5 border-r border-zinc-200 text-right font-mono text-zinc-400">{formatCurrency(item.movements.debit)}</td>
                                <td className="px-2 py-2.5 border-r border-zinc-200 text-right font-mono text-zinc-400">{formatCurrency(item.movements.credit)}</td>
                                <td className={`px-2 py-2.5 border-r border-zinc-200 text-right font-mono font-bold ${item.closingBalance.balance < 0 ? 'text-rose-500' : 'text-zinc-600'}`}>{formatCurrency(item.closingBalance.balance)}</td>
                                <td className={`px-2 py-2.5 text-right font-mono font-black ${item.closingBalance.final < 0 ? 'text-rose-600' : 'text-zinc-800'}`}>{formatCurrency(item.closingBalance.final)}</td>
                            </tr>
                        ))}
                        {/* Group Total Row */}
                        <tr className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-900 border-b border-zinc-200">
                            <td colSpan={3} className="px-6 py-2.5 text-right border-r border-zinc-200 font-black">{groupName} Total:</td>
                            <td className={`px-2 py-2.5 text-right border-r border-zinc-200 font-mono font-black ${groupTotal.initial < 0 ? 'text-rose-600' : 'text-zinc-900'}`}>{formatCurrency(groupTotal.initial)}</td>
                            <td className="px-2 py-2.5 text-right border-r border-zinc-200 font-mono text-emerald-600 font-black">{formatCurrency(groupTotal.openingDebit)}</td>
                            <td className="px-2 py-2.5 text-right border-r border-zinc-200 font-mono font-black">{formatCurrency(groupTotal.openingCredit)}</td>
                            <td className="px-2 py-2.5 text-right border-r border-zinc-200 font-mono font-black">{formatCurrency(groupTotal.movementsDebit)}</td>
                            <td className="px-2 py-2.5 text-right border-r border-zinc-200 font-mono font-black">{formatCurrency(groupTotal.movementsCredit)}</td>
                            <td className={`px-2 py-2.5 text-right border-r border-zinc-200 font-mono font-black ${groupTotal.balance < 0 ? 'text-rose-600' : 'text-zinc-900'}`}>{formatCurrency(groupTotal.balance)}</td>
                            <td className={`px-2 py-2.5 text-right font-mono font-black ${groupTotal.final < 0 ? 'text-rose-600' : 'text-zinc-900'}`}>{formatCurrency(groupTotal.final)}</td>
                        </tr>
                    </React.Fragment>
                );
              })}
            </tbody>
            {/* GRAND TOTAL FOOTER */}
            <tfoot>
                <tr className="bg-zinc-800 text-white text-[11px] font-black uppercase tracking-widest border-t-2 border-zinc-900 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                    <td colSpan={3} className="px-6 py-4 text-right border-r border-white/10">GRAND TOTAL:</td>
                    <td className="px-2 py-4 text-right border-r border-white/10 font-mono text-rose-400">{formatCurrency(report.grandTotals.initial)}</td>
                    <td className="px-2 py-4 text-right border-r border-white/10 font-mono text-emerald-400">{formatCurrency(report.grandTotals.openingDebit)}</td>
                    <td className="px-2 py-4 text-right border-r border-white/10 font-mono text-zinc-300">{formatCurrency(report.grandTotals.openingCredit)}</td>
                    <td className="px-2 py-4 text-right border-r border-white/10 font-mono">0</td>
                    <td className="px-2 py-4 text-right border-r border-white/10 font-mono">0</td>
                    <td className="px-2 py-4 text-right border-r border-white/10 font-mono text-rose-400">{formatCurrency(report.grandTotals.balance)}</td>
                    <td className="px-2 py-4 text-right font-mono text-rose-400">{formatCurrency(report.grandTotals.final)}</td>
                </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="flex justify-center pb-8 opacity-40">
        <p className="text-[11px] font-medium text-zinc-500">Report calculated using Double-Entry standards | As of April 02, 2026</p>
      </div>
    </div>
  );
};
