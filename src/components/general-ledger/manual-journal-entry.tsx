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

  const handleReset = () => {
    setDate("2026-04-01");
    setVoucher("JV-20260401-001");
    setRows([
      { id: "row-1", accountId: "", narration: "", debit: 0, credit: 0 },
      { id: "row-2", accountId: "", narration: "", debit: 0, credit: 0 },
    ]);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-blue-600 px-4 py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Manual Journal Entry</h3>
        </div>
        <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">Optional</span>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Top Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-500">Date *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-8 text-[12px]" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-500">Voucher Number *</label>
            <Input value={voucher} onChange={(e) => setVoucher(e.target.value)} className="h-8 text-[12px]" />
            <p className="text-[10px] text-zinc-300">Auto-generated or enter custom voucher</p>
          </div>
        </div>

        {/* Entries list */}
        <div className="space-y-4">
          <h4 className="text-[12px] font-semibold text-zinc-600">Journal Entries</h4>

          <div className="space-y-4">
            {rows.map((row, index) => {
              const account = MOCK_ACCOUNTS.find((a) => a.id === row.accountId);

              return (
                <div key={row.id} className="relative p-3 border rounded-lg border-zinc-100 bg-zinc-50/30">
                  <div className="absolute -top-2.5 left-3">
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 font-semibold rounded">
                      Entry #{index + 1}
                    </span>
                  </div>
                  {rows.length > 2 && (
                    <button 
                      onClick={() => removeRow(row.id)}
                      className="absolute -top-2 right-3 bg-red-50 text-red-500 p-1 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mt-2">
                    <div className="sm:col-span-1 lg:col-span-3 space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Account *</label>
                      <Select value={row.accountId} onValueChange={(val) => updateRow(row.id, "accountId", val)}>
                        <SelectTrigger className="bg-white h-8 text-[12px]">
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
                    
                    <div className="sm:col-span-1 lg:col-span-3 space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Account Name</label>
                      <Input value={account?.name || ""} disabled className="bg-zinc-100/50 h-8 text-[12px]" />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-6 space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Narration *</label>
                      <Input 
                        placeholder="Description of this entry" 
                        value={row.narration}
                        onChange={(e) => updateRow(row.id, "narration", e.target.value)}
                        className="bg-white h-8 text-[12px]"
                      />
                    </div>

                    <div className="sm:col-span-1 lg:col-span-3 space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Debit (Dr)</label>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
                        placeholder="0.00" 
                        value={row.debit || ""}
                        onChange={(e) => updateRow(row.id, "debit", parseFloat(e.target.value) || 0)}
                        className="bg-white text-emerald-600 font-semibold border-emerald-200 focus-visible:ring-emerald-500/20 h-8 text-[12px]"
                      />
                    </div>

                    <div className="sm:col-span-1 lg:col-span-3 space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Credit (Cr)</label>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
                        placeholder="0.00" 
                        value={row.credit || ""}
                        onChange={(e) => updateRow(row.id, "credit", parseFloat(e.target.value) || 0)}
                        className="bg-white text-rose-600 font-semibold border-rose-200 focus-visible:ring-rose-500/20 h-8 text-[12px]"
                      />
                    </div>
                    
                    <div className="sm:col-span-2 lg:col-span-6 flex items-end">
                      <p className="text-[10px] text-zinc-400 bg-white p-2 rounded border border-zinc-100 w-full text-center">
                        <span className="font-medium text-zinc-500">Note:</span> Ending = Beginning + (Dr - Cr)
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
            className="w-full h-9 border-dashed border-zinc-200 text-zinc-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/30 text-[12px] font-medium"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Another Journal Entry
          </Button>
        </div>

        {/* Summary Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-zinc-50/50 border border-zinc-100 rounded-lg p-3 space-y-1.5 text-[12px] font-medium">
            <div className="flex justify-between text-zinc-500">
              <span>Total Debits:</span>
              <span className="text-emerald-600 font-semibold">{totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Total Credits:</span>
              <span className="text-rose-600 font-semibold">{totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="h-px bg-zinc-100" />
            <div className="flex justify-between items-center text-zinc-700">
              <span>Difference:</span>
              <div className="flex items-center gap-1.5">
                <span className={`font-semibold ${difference === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {difference.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {difference === 0 && totalDebits > 0 && <span className="text-emerald-500 text-xs">✓</span>}
              </div>
            </div>
          </div>

          <div className={`p-3 rounded-lg flex items-start gap-2.5 text-[12px] ${isBalanced ? 'bg-emerald-50/50 border border-emerald-100 text-emerald-700' : 'bg-amber-50/50 border border-amber-100 text-amber-700'}`}>
            <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${isBalanced ? 'text-emerald-500' : 'text-amber-500'}`} />
            <div>
              <p className="font-semibold text-[11px]">{isBalanced ? "Entries balanced." : "Entries must balance."}</p>
              <p className="opacity-70 mt-0.5 text-[11px]">Total debits must equal total credits to save.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-center gap-2">
        <Button 
          disabled={!isBalanced} 
          className="h-8 flex-1 bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-40 text-[12px]"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          Save Journal Entry
        </Button>
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="h-8 flex-1 font-medium text-zinc-500 text-[12px]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset Form
        </Button>
      </div>
    </div>
  );
}
