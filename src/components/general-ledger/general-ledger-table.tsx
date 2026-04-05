"use client";

import React, { useState, useEffect } from "react";
import { Table as TableIcon, Loader2 } from "lucide-react";
import { getLedgerEntries } from "@/services/ledger.service";

export function GeneralLedgerTable() {
  const [entries, setEntries] = useState<any[]>([]);
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { entries, totals } = await getLedgerEntries();
        setEntries(entries);
        setTotals(totals);
      } catch (err) {
        console.error("Failed to load ledger", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const fmt = (amount: number) => amount.toLocaleString("en-US", { minimumFractionDigits: 2 });

  if (isLoading) {
    return (
      <div className="p-20 text-center space-y-4 bg-white rounded-xl border border-zinc-100 italic font-medium text-zinc-400 animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
        <p className="text-[11px] uppercase tracking-widest font-black">Syncing Unified Ledger...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
      <div className="bg-zinc-500 px-4 py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <TableIcon className="w-4 h-4 opacity-80" />
          <h3 className="font-semibold text-sm">General Ledger</h3>
        </div>
        <span className="text-[10px] font-medium px-2.5 py-0.5 bg-black/10 rounded-full">Showing last 1000 entries</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12px] text-left whitespace-nowrap">
          <thead className="text-[10px] text-blue-600 bg-blue-50/40 font-semibold border-b border-zinc-100 uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2.5">Date</th>
              <th className="px-3 py-2.5">Account (Class)</th>
              <th className="px-3 py-2.5">Account Name</th>
              <th className="px-3 py-2.5">Vch #</th>
              <th className="px-3 py-2.5">Particular</th>
              <th className="px-3 py-2.5 text-right">Beginning</th>
              <th className="px-3 py-2.5 text-right">Dr</th>
              <th className="px-3 py-2.5 text-right">Cr</th>
              <th className="px-3 py-2.5 text-right">Movement</th>
              <th className="px-3 py-2.5 text-right">Ending</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 bg-white">
            {entries.map((tx) => (
              <tr key={tx.id} className="hover:bg-zinc-50/50 transition-colors text-zinc-500 font-medium">
                <td className="px-3 py-2">{tx.date}</td>
                <td className="px-3 py-2">
                  <div className="font-bold text-zinc-700 text-[11px]">{tx.accountClass.split(' ')[0]}</div>
                  <div className="text-[9px] text-zinc-400 uppercase tracking-wider">{tx.accountClass.split(' ').slice(1).join(' ')}</div>
                </td>
                <td className="px-3 py-2 text-zinc-600">{tx.accountName}</td>
                <td className="px-3 py-2">
                  <span className="font-mono text-[10px] font-semibold bg-rose-50 text-rose-500 border border-rose-100 rounded py-0.5 px-1.5 inline-block">
                    {tx.voucherNumber}
                  </span>
                </td>
                <td className="px-3 py-2 text-zinc-400">{tx.particulars}</td>
                <td className="px-3 py-2 text-right font-semibold text-emerald-600">
                  {tx.beginningBalance === 0 ? "0.00" : fmt(tx.beginningBalance)}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-emerald-600">
                  {tx.debit > 0 ? fmt(tx.debit) : '-'}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-rose-500">
                  {tx.credit > 0 ? fmt(tx.credit) : '-'}
                </td>
                <td className={`px-3 py-2 text-right font-semibold ${tx.movement >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {fmt(tx.movement)}
                </td>
                <td className={`px-3 py-2 text-right font-semibold ${tx.endingBalance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {fmt(tx.endingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-zinc-50/60 font-semibold border-t border-zinc-100 text-right">
            <tr>
              <td colSpan={6} className="px-3 py-3 text-zinc-700 text-[12px] text-right">Totals:</td>
              <td className="px-3 py-3 text-emerald-600 text-[12px]">{fmt(totals.debit)}</td>
              <td className="px-3 py-3 text-rose-500 text-[12px]">{fmt(totals.credit)}</td>
              <td className={`px-3 py-3 text-[12px] ${totals.debit - totals.credit === 0 ? 'text-blue-600' : 'text-rose-500'}`}>
                {fmt(totals.debit - totals.credit)}
              </td>
              <td className="px-3 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
