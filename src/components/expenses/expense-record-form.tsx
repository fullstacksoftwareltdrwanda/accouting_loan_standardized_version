"use client";

import React, { useState, useEffect } from "react";
import { ReceiptText, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GLAccount } from "@/types/account";
import { Expense } from "@/types/expense";

interface ExpenseRecordFormProps {
  accounts: GLAccount[];
  onSubmit: (expense: Partial<Expense>) => Promise<void>;
  isLoading: boolean;
}

export const ExpenseRecordForm = ({ accounts, onSubmit, isLoading }: ExpenseRecordFormProps) => {
  const [formData, setFormData] = useState({
    expenseAccount: "",
    paymentAccount: "",
    date: new Date().toISOString().split('T')[0],
    amount: "0",
    description: "",
  });

  const expenseAccounts = accounts.filter(acc => acc.category === "Expense" || acc.category === "Income Statement");
  const paymentAccounts = accounts.filter(acc => acc.accountType === "Cash" || acc.accountType === "Bank");

  const selectedExpenseAccount = accounts.find(a => a.code === formData.expenseAccount);
  const selectedPaymentAccount = accounts.find(a => a.code === formData.paymentAccount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      accountCode: formData.expenseAccount,
      date: formData.date,
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: selectedExpenseAccount?.category as any || "Administrative",
    });
    // Reset form
    setFormData({
      expenseAccount: "",
      paymentAccount: "",
      date: new Date().toISOString().split('T')[0],
      amount: "0",
      description: "",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 bg-rose-500 px-4 py-2.5 text-white font-black text-sm uppercase tracking-wider">
        <ReceiptText className="h-4 w-4" />
        Record New Expense
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 flex flex-col h-full">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Expense Account <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.expenseAccount} 
            onValueChange={(val) => setFormData(prev => ({ ...prev, expenseAccount: val }))}
          >
            <SelectTrigger className="h-10 text-[13px] border-zinc-200 focus:ring-rose-500/20 focus:border-rose-300">
              <SelectValue placeholder="-- Select Expense Account --" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4} className="max-h-[300px] w-[var(--radix-select-trigger-width)]">
              {expenseAccounts.map(acc => (
                <SelectItem key={acc.id} value={acc.code}>{acc.code} - {acc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Payment Account <span className="text-red-500">*</span></Label>
            <Select 
                value={formData.paymentAccount} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, paymentAccount: val }))}
            >
                <SelectTrigger className="h-10 text-[13px] border-zinc-200 focus:ring-rose-500/20 focus:border-rose-300">
                    <SelectValue placeholder="-- Select Cash/Bank Account --" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="max-h-[300px] w-[var(--radix-select-trigger-width)]">
                    {paymentAccounts.map(acc => (
                        <SelectItem key={acc.id} value={acc.code}>{acc.code} - {acc.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Expense Date <span className="text-red-500">*</span></Label>
                <Input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="h-10 text-[13px] border-zinc-200"
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Amount (Rwf) <span className="text-red-500">*</span></Label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400 group-focus-within:text-rose-500 font-bold text-[12px]">Rwf</div>
                    <Input 
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        className="h-10 pl-12 text-[13px] font-black border-zinc-200"
                    />
                </div>
            </div>
        </div>

        <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Description / Particular <span className="text-red-500">*</span></Label>
            <Textarea 
                placeholder="Enter description — this will be saved as the Particular in the ledger..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[80px] text-[13px] border-zinc-200 resize-none"
            />
            <p className="text-[10px] text-zinc-400 font-medium italic">This text is recorded as the Particular on every ledger entry for this expense.</p>
        </div>

        {/* Entry Preview */}
        <div className="mt-2 rounded-xl bg-cyan-50/50 border border-cyan-100 p-4 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-cyan-700">Accounting Entry Preview</h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Debit:</p>
                    <p className="text-[12px] font-black text-emerald-700 truncate">{selectedExpenseAccount ? selectedExpenseAccount.name : "[Expense Account]"}</p>
                </div>
                <div className="space-y-0.5 border-l border-cyan-200/50 pl-4">
                    <p className="text-[10px] font-bold text-rose-500 uppercase">Credit:</p>
                    <p className="text-[12px] font-black text-rose-600 truncate">{selectedPaymentAccount ? selectedPaymentAccount.name : "[Payment Account]"}</p>
                </div>
            </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-11 mt-2 bg-rose-500 hover:bg-rose-600 text-white font-black shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Expense & Ledger Entries
        </Button>
      </form>
    </div>
  );
};
