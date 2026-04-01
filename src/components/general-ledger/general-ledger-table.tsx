"use client";

import React from "react";
import { Table as TableIcon } from "lucide-react";
import { MOCK_LEDGER_TRANSACTIONS } from "@/data/mock/ledger";

export function GeneralLedgerTable() {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
  };

  return (
    <div className="bg-white rounded-[24px] border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800 overflow-hidden">
      <div className="bg-zinc-500 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <TableIcon className="w-5 h-5 opacity-80" />
          <h3 className="font-bold text-lg tracking-wide">General Ledger</h3>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-black/10 rounded-full text-zinc-100">Showing last 1000 entries</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-blue-600 bg-blue-50/50 font-bold border-b border-zinc-200 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Account (Class)</th>
              <th className="px-4 py-4">Account Name</th>
              <th className="px-4 py-4">Vch #</th>
              <th className="px-4 py-4">Particular</th>
              <th className="px-4 py-4 text-right">Beginning</th>
              <th className="px-4 py-4 text-right text-blue-500">Dr</th>
              <th className="px-4 py-4 text-right text-blue-500">Cr</th>
              <th className="px-4 py-4 text-right">Movement</th>
              <th className="px-4 py-4 text-right">Ending</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {MOCK_LEDGER_TRANSACTIONS.map((tx) => (
              <tr key={tx.id} className="hover:bg-zinc-50/80 transition-colors text-zinc-600 font-medium">
                <td className="px-4 py-3">{tx.date}</td>
                <td className="px-4 py-3">
                  <div className="font-extrabold text-zinc-800">{tx.accountClass.split(' ')[0]}</div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{tx.accountClass.split(' ')[1]}</div>
                </td>
                <td className="px-4 py-3 text-zinc-700">{tx.accountName}</td>
                <td className="px-4 py-3">
                  <div className="font-mono text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-100 rounded-md py-1 px-2 inline-block">
                    {tx.voucherNumber}
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-500">{tx.particulars}</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600">
                  {tx.beginningBalance === 0 ? "0.00" : formatCurrency(tx.beginningBalance)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600">
                  {tx.debit > 0 ? formatCurrency(tx.debit) : '-'}
                </td>
                <td className="px-4 py-3 text-right font-bold text-rose-600">
                  {tx.credit > 0 ? formatCurrency(tx.credit) : '-'}
                </td>
                <td className={`px-4 py-3 text-right font-bold ${tx.movement >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(tx.movement)}
                </td>
                <td className={`px-4 py-3 text-right font-bold ${tx.endingBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(tx.endingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-zinc-50/80 font-bold border-t border-zinc-200 text-right">
            <tr>
              <td colSpan={6} className="px-4 py-5 text-zinc-800 text-lg tracking-tight">Totals:</td>
              <td className="px-4 py-5 text-emerald-600 text-base">10,001,500.00</td>
              <td className="px-4 py-5 text-rose-600 text-base">10,001,500.00</td>
              <td className="px-4 py-5 text-blue-600 text-base">0.00</td>
              <td className="px-4 py-5"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
