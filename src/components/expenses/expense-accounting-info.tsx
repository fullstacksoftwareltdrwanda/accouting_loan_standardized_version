"use client";

import React from "react";
import { Info, HelpCircle } from "lucide-react";

export const ExpenseAccountingInfo = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 bg-cyan-500 px-4 py-2.5 text-white font-black text-sm uppercase tracking-wider">
        <HelpCircle className="h-4 w-4" />
        Accounting Info
      </div>

      <div className="p-6 space-y-6">
        {/* Double Entry Box */}
        <div className="rounded-xl bg-[#fffcf0] border border-[#f5efc9] p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Info className="w-12 h-12 text-amber-500" />
            </div>
            
            <h4 className="text-[13px] font-black text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-amber-400 rounded-full" />
                Double Entry Rule
            </h4>
            
            <div className="space-y-4 relative z-10">
                <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-black text-emerald-700 uppercase tracking-tight">Debit: Expense Account (increase)</span>
                    <p className="text-[11px] text-emerald-600/80 font-medium">When you record an expense, it increases the total expenditure.</p>
                </div>
                
                <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-black text-rose-600 uppercase tracking-tight">Credit: Asset/Liability Account (decrease)</span>
                    <p className="text-[11px] text-rose-500/80 font-medium">Payment is made from Cash/Bank, decreasing your assets.</p>
                </div>
            </div>
        </div>

        {/* Dynamic Tips */}
        <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Entry Guidelines</h5>
            <div className="space-y-3">
                <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-zinc-400">01</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal font-medium">Ensure the correct expense category is selected for accurate P&L reporting.</p>
                </div>
                <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-zinc-400">02</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal font-medium">Descriptions should be clear as they appear exactly on the Ledger report.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
