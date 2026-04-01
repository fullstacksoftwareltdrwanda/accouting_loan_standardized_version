"use client";

import React from "react";
import { History } from "lucide-react";
import { MOCK_RECENT_ENTRIES } from "@/data/mock/ledger";

export function RecentEntries() {
  return (
    <div className="bg-white rounded-[24px] border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800 overflow-hidden flex flex-col h-full">
      <div className="bg-cyan-500 p-4 flex items-center gap-2 text-white">
        <History className="w-5 h-5" />
        <h3 className="font-bold text-lg">Recent Ledger Entries</h3>
      </div>
      
      <div className="p-0 overflow-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-blue-600 bg-blue-50/50 uppercase font-bold sticky top-0">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Voucher</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3 text-right">Dr/Cr</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {MOCK_RECENT_ENTRIES.map((entry) => (
              <React.Fragment key={entry.id}>
                {entry.lines.map((line, idx) => {
                  const isDebit = line.debit > 0;
                  const amount = isDebit ? line.debit : line.credit;
                  return (
                    <tr key={`${entry.id}-${line.accountId}-${idx}`} className="hover:bg-zinc-50/50">
                      <td className="px-4 py-3 text-zinc-600 font-medium">{entry.date.slice(0, 5)}</td>
                      <td className="px-4 py-3 text-zinc-500 font-mono text-[11px] bg-zinc-100 rounded-sm m-2 inline-block">
                        {entry.voucherNumber}
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-700">{line.accountId}</td>
                      <td className="px-4 py-3 text-right font-bold flex justify-end">
                        <span className={`px-2 py-0.5 rounded text-xs text-white ${isDebit ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                          {isDebit ? 'Dr:' : 'Cr:'} {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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

      <div className="border-t border-zinc-200">
        <div className="bg-zinc-600 text-white p-2.5 px-4 font-bold rounded-t-lg mx-4 mt-4">
          Today's Summary
        </div>
        <div className="grid grid-cols-3 divide-x divide-zinc-100 py-4 px-4 bg-white mb-2">
          <div className="text-center space-y-1">
            <p className="text-xl font-black text-zinc-800">2</p>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Entries</p>
          </div>
          <div className="text-center space-y-1">
             <p className="text-lg font-bold text-emerald-600">10,001,600.00</p>
             <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Debits</p>
          </div>
          <div className="text-center space-y-1">
             <p className="text-lg font-bold text-rose-600">10,001,600.00</p>
             <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Credits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
