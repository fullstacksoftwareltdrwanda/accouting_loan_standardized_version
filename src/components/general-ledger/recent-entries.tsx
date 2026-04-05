"use client";

import React, { useState, useEffect } from "react";
import { History, Loader2 } from "lucide-react";
import { getLedgerEntries } from "@/services/ledger.service";

interface GroupedEntry {
  id: string;
  date: string;
  voucherNumber: string;
  lines: Array<{
    accountId: string;
    debit: number;
    credit: number;
  }>;
}

export function RecentEntries() {
  const [entries, setEntries] = useState<GroupedEntry[]>([]);
  const [totals, setTotals] = useState({ debit: 0, credit: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { entries: rawEntries, totals: apiTotals } = await getLedgerEntries({ limit: 50 });
        // Group by voucherNumber (reference)
        const groups: Record<string, GroupedEntry> = {};
        rawEntries.forEach((e: any) => {
          if (!groups[e.voucherNumber]) {
            groups[e.voucherNumber] = {
              id: e.voucherNumber,
              date: e.date,
              voucherNumber: e.voucherNumber,
              lines: []
            };
          }
          groups[e.voucherNumber].lines.push({
            accountId: e.accountCode,
            debit: Number(e.debit),
            credit: Number(e.credit)
          });
        });

        const entryGroups = Object.values(groups);
        setEntries(entryGroups.slice(0, 10)); // Top 10 groups
        
        // Calculate totals for the loaded set
        const visibleDr = rawEntries.reduce((s, e) => s + Number(e.debit), 0);
        const visibleCr = rawEntries.reduce((s, e) => s + Number(e.credit), 0);
        setTotals({ debit: visibleDr, credit: visibleCr, count: entryGroups.length });

      } catch (err) {
        console.error("Recent entries load failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const fmt = (v: number) => v.toLocaleString();

  if (isLoading) {
    return (
      <div className="p-10 text-center space-y-3 bg-white rounded-xl border border-zinc-100 flex-1 flex flex-col justify-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-cyan-500" />
        <p className="text-[10px] uppercase font-black text-zinc-400">Loading History...</p>
      </div>
    );
  }

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
            {entries.map((entry) => (
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
          Summary (Visible)
        </div>
        <div className="grid grid-cols-3 divide-x divide-zinc-100 py-3 px-3 bg-white mb-1">
          <div className="text-center space-y-0.5">
            <p className="text-base font-bold text-zinc-700">{totals.count}</p>
            <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">Entries</p>
          </div>
          <div className="text-center space-y-0.5">
             <p className="text-sm font-bold text-emerald-600">{fmt(totals.debit)}</p>
             <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">Debits</p>
          </div>
          <div className="text-center space-y-0.5">
             <p className="text-sm font-bold text-rose-600">{fmt(totals.credit)}</p>
             <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">Credits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
