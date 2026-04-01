"use client";

import React, { useState } from "react";
import { Plus, Save, RotateCcw, FileText, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_ACCOUNTS } from "@/data/mock/accounts";

interface JournalEntryRow {
  id: string;
  accountId: string;
  narration: string;
  debit: number;
  credit: number;
}

export function ManualJournalEntry() {
  const [date, setDate] = useState("2026-04-01");
  const [voucher, setVoucher] = useState("JV-20260401-001");
  
  const [rows, setRows] = useState<JournalEntryRow[]>([
    { id: "row-1", accountId: "", narration: "", debit: 0, credit: 0 },
    { id: "row-2", accountId: "", narration: "", debit: 0, credit: 0 },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      { id: `row-${Date.now()}`, accountId: "", narration: "", debit: 0, credit: 0 },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 2) {
      setRows(rows.filter((r) => r.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof JournalEntryRow, value: string | number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const totalDebits = rows.reduce((sum, row) => sum + (Number(row.debit) || 0), 0);
  const totalCredits = rows.reduce((sum, row) => sum + (Number(row.credit) || 0), 0);
  const difference = Math.abs(totalDebits - totalCredits);
  const isBalanced = difference === 0 && totalDebits > 0;

  return (
    <div className="bg-white rounded-[24px] border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h3 className="font-bold text-lg">Manual Journal Entry</h3>
        </div>
        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">Optional</span>
      </div>

      <div className="p-6 space-y-8 flex-1">
        {/* Top Info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Date *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Voucher Number *</label>
            <Input value={voucher} onChange={(e) => setVoucher(e.target.value)} />
            <p className="text-xs text-zinc-400">Auto-generated or enter custom voucher</p>
          </div>
        </div>

        {/* Entries list */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-800 flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm border-2 border-zinc-800" />
              Journal Entries
            </h4>
          </div>

          <div className="space-y-8">
            {rows.map((row, index) => {
              const account = MOCK_ACCOUNTS.find((a) => a.id === row.accountId);

              return (
                <div key={row.id} className="relative p-4 border rounded-xl border-zinc-100 bg-zinc-50/50">
                  <div className="absolute -top-3 left-4">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 font-bold rounded-md shadow-sm">
                      Entry #{index + 1}
                    </span>
                  </div>
                  {rows.length > 2 && (
                    <button 
                      onClick={() => removeRow(row.id)}
                      className="absolute -top-3 right-4 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-xs font-semibold text-zinc-600">Account (Class) *</label>
                      <Select value={row.accountId} onValueChange={(val) => updateRow(row.id, "accountId", val)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_ACCOUNTS.map((acc) => (
                            <SelectItem key={acc.id} value={acc.id}>
                              {acc.code} - {acc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-xs font-semibold text-zinc-600">Account Name</label>
                      <Input value={account?.name || ""} disabled className="bg-zinc-100/50" />
                    </div>

                    <div className="md:col-span-6 space-y-2">
                      <label className="text-xs font-semibold text-zinc-600">Narration / Particular *</label>
                      <Input 
                        placeholder="Description of this entry" 
                        value={row.narration}
                        onChange={(e) => updateRow(row.id, "narration", e.target.value)}
                        className="bg-white"
                      />
                      <p className="text-[10px] text-zinc-400 mt-1">Saved as the Particular for this entry</p>
                    </div>

                    <div className="md:col-span-3 space-y-2">
                      <label className="text-xs font-semibold text-zinc-600">Debit (Dr)</label>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
                        placeholder="0.00" 
                        value={row.debit || ""}
                        onChange={(e) => updateRow(row.id, "debit", parseFloat(e.target.value) || 0)}
                        className="bg-white text-emerald-600 font-semibold border-emerald-200 focus-visible:ring-emerald-500"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-2">
                      <label className="text-xs font-semibold text-zinc-600">Credit (Cr)</label>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
                        placeholder="0.00" 
                        value={row.credit || ""}
                        onChange={(e) => updateRow(row.id, "credit", parseFloat(e.target.value) || 0)}
                        className="bg-white text-rose-600 font-semibold border-rose-200 focus-visible:ring-rose-500"
                      />
                    </div>
                    
                    <div className="md:col-span-6 flex items-end">
                      <p className="text-[11px] text-zinc-500 bg-white p-2.5 rounded-md border border-zinc-100 w-full text-center">
                        <span className="font-semibold text-zinc-700">Note:</span> Beginning balance = Previous ending balance<br/>
                        Ending balance = Beginning + (Debit - Credit)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button 
            onClick={addRow} 
            variant="outline" 
            className="w-full h-12 border-dashed border-2 border-zinc-300 text-zinc-600 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 font-semibold transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Journal Entry
          </Button>
        </div>

        {/* Summary Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-cyan-50/20 border border-cyan-100 rounded-xl p-4 space-y-2 text-sm font-medium">
            <div className="flex justify-between text-zinc-600">
              <span>Total Debits:</span>
              <span className="text-emerald-600 font-bold">{totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Total Credits:</span>
              <span className="text-rose-600 font-bold">{totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="h-px bg-cyan-100 my-2" />
            <div className="flex justify-between items-center text-zinc-800">
              <span>Difference:</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${difference === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {difference.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {difference === 0 && totalDebits > 0 && <span className="text-emerald-500 font-bold">✓</span>}
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-start gap-3 text-sm ${isBalanced ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
            <ShieldAlert className={`w-5 h-5 shrink-0 ${isBalanced ? 'text-emerald-500' : 'text-amber-500'}`} />
            <div>
              <p className="font-semibold">{isBalanced ? "Journal entries balance." : "Journal entries must balance."}</p>
              <p className="opacity-80 mt-1 flex-wrap">Total debits must equal total credits before you can save.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-zinc-50 border-t flex items-center justify-center gap-3 rounded-b-[24px]">
        <Button 
          disabled={!isBalanced} 
          className="h-11 flex-1 bg-blue-600 hover:bg-blue-700 font-bold shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Journal Entry
        </Button>
        <Button variant="outline" className="h-11 flex-1 font-semibold text-zinc-600 bg-zinc-500 border-zinc-500 hover:bg-zinc-600 text-white hover:text-white">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Form
        </Button>
      </div>
    </div>
  );
}
