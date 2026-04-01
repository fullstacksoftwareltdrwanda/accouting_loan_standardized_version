"use client";

import React from "react";
import { History } from "lucide-react";
import { MOCK_RECENT_ENTRIES } from "@/data/mock/ledger";

export function RecentEntries() {
  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-cyan-500 px-4 py-2.5 flex items-center gap-2 text-white">
        <History className="w-4 h-4" />
        <h3 className="font-semibold text-sm">Recent Ledger Entries</h3>
      </div>
      
      <div className="p-0 overflow-auto flex-1">
        <table className="w-full text-[12px] text-left">
          <thead className="text-[10px] text-blue-600 bg-blue-50/40 uppercase font-semibold sticky top-0 tracking-wider">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Voucher</th>
              <th className="px-3 py-2">Acct</th>
              <th className="px-3 py-2 text-right">Dr/Cr</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {MOCK_RECENT_ENTRIES.map((entry) => (
              <React.Fragment key={entry.id}>
                {entry.lines.map((line, idx) => {
                  const isDebit = line.debit > 0;
                  const amount = isDebit ? line.debit : line.credit;
                  return (
                    <tr key={`${entry.id}-${line.accountId}-${idx}`} className="hover:bg-zinc-50/50">
                      <td className="px-3 py-2 text-zinc-500 font-medium">{entry.date.slice(0, 5)}</td>
                      <td className="px-3 py-2">
                        <span className="text-zinc-400 font-mono text-[10px]">
                          {entry.voucherNumber.slice(0, 12)}...
                        </span>
                      </td>
                      <td className="px-3 py-2 font-medium text-zinc-600">{line.accountId}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${isDebit ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                          {isDebit ? 'Dr' : 'Cr'}: {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-zinc-100">
        <div className="bg-zinc-600 text-white px-3 py-1.5 text-[11px] font-semibold rounded-t-md mx-3 mt-3">
          Today&apos;s Summary
        </div>
        <div className="grid grid-cols-3 divide-x divide-zinc-100 py-3 px-3 bg-white mb-1">
          <div className="text-center space-y-0.5">
            <p className="text-base font-bold text-zinc-700">2</p>
            <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">Entries</p>
          </div>
          <div className="text-center space-y-0.5">
             <p className="text-sm font-bold text-emerald-600">10,001,600</p>
             <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">Debits</p>
          </div>
          <div className="text-center space-y-0.5">
             <p className="text-sm font-bold text-rose-600">10,001,600</p>
             <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">Credits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
