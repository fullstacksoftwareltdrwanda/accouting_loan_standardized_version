"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GLAccount, AccountCategory, NormalBalance } from "@/types/account";
import { 
    ACCOUNT_CLASSES, 
    ACCOUNT_TYPES, 
    ACCOUNT_SUB_TYPES, 
    NORMAL_BALANCES 
} from "@/config/accounting-constants";

interface AccountFormCardProps {
  onAdd: (account: Partial<GLAccount>) => Promise<void>;
  isLoading?: boolean;
}

export const AccountFormCard = ({ onAdd, isLoading }: AccountFormCardProps) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "Asset" as AccountCategory,
    accountType: "",
    subType: "",
    normalBalance: "Debit" as NormalBalance,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd({
      ...formData,
      status: formData.isActive ? "active" : "inactive",
    });
    // Reset form
    setFormData({
      code: "",
      name: "",
      category: "Asset",
      accountType: "",
      subType: "",
      normalBalance: "Debit",
      isActive: true,
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 bg-blue-600 px-4 py-2.5 text-white">
        <PlusCircle className="h-4 w-4" />
        <h3 className="text-sm font-bold uppercase tracking-wider">Add New Account</h3>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-[11px] font-bold uppercase text-zinc-500">
              Account Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              placeholder="Enter code"
              value={formData.code}
              onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
              required
              className="h-9 text-[13px] border-zinc-200 focus:border-blue-400 focus:ring-blue-400/10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[11px] font-bold uppercase text-zinc-500">
              Account Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              className="h-9 text-[13px] border-zinc-200 focus:border-blue-400 focus:ring-blue-400/10"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase text-zinc-500">
              Class <span className="text-red-500">*</span>
            </Label>
            <Select 
                value={formData.category} 
                onValueChange={(val: AccountCategory) => setFormData(p => ({...p, category: val}))}
            >
              <SelectTrigger className="h-9 text-[13px] border-zinc-200">
                <SelectValue placeholder="-- Select Class --" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_CLASSES.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase text-zinc-500">
              Account Type <span className="text-red-500">*</span>
            </Label>
            <Select 
                value={formData.accountType} 
                onValueChange={(val) => setFormData(p => ({...p, accountType: val}))}
            >
              <SelectTrigger className="h-9 text-[13px] border-zinc-200">
                <SelectValue placeholder="-- Select Type --" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase text-zinc-500">
              Sub Type <span className="text-red-500">*</span>
            </Label>
            <Select 
                value={formData.subType} 
                onValueChange={(val) => setFormData(p => ({...p, subType: val}))}
            >
              <SelectTrigger className="h-9 text-[13px] border-zinc-200">
                <SelectValue placeholder="-- Select Sub Type --" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_SUB_TYPES.map(subType => (
                    <SelectItem key={subType} value={subType}>{subType}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase text-zinc-500">
              Normal Balance <span className="text-red-500">*</span>
            </Label>
            <Select 
                value={formData.normalBalance} 
                onValueChange={(val: NormalBalance) => setFormData(p => ({...p, normalBalance: val}))}
            >
              <SelectTrigger className="h-9 text-[13px] border-zinc-200">
                <SelectValue placeholder="-- Select Balance --" />
              </SelectTrigger>
              <SelectContent>
                {NORMAL_BALANCES.map(bal => (
                    <SelectItem key={bal} value={bal}>{bal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked as boolean }))}
            />
            <Label htmlFor="isActive" className="text-[13px] font-medium text-zinc-600">
              Account is Active
            </Label>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 shadow-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </form>
    </div>
  );
};
