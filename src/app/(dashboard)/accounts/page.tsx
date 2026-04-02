"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Home } from "lucide-react";
import { AccountList } from "@/components/accounts/account-list";
import { AccountFormCard } from "@/components/accounts/account-form-card";
import { AccountStats } from "@/components/accounts/account-stats";
import { GLAccount } from "@/types/account";
import { getAccounts, createAccount } from "@/services/mock/account.service";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<GLAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load accounts
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAccounts();
        setAccounts(data);
      } catch (error) {
        console.error("Failed to load accounts", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleAddAccount = async (data: Partial<GLAccount>) => {
    setIsSubmitting(true);
    try {
      const newAcc = await createAccount(data);
      setAccounts((prev) => [...prev, newAcc].sort((a, b) => a.code.localeCompare(b.code)));
    } catch (error) {
      console.error("Creation failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Breadcrumbs & Title Area */}
      <div className="space-y-4">
        <nav className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
          <span className="text-zinc-400 flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
            <Home className="h-4 w-4" />
            Home
          </span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-600 font-semibold">Chart of Accounts</span>
        </nav>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-blue-600">
            Chart of Accounts Management
          </h1>
          <p className="text-[14px] text-zinc-500">
            Manage your accounting chart of accounts
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 gap-8 max-w-[1280px]">
        {/* Step 1: Add New Account Form */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AccountFormCard onAdd={handleAddAccount} isLoading={isSubmitting} />
        </section>

        {/* Step 2: Account Statistics */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AccountStats accounts={accounts} />
        </section>

        {/* Step 3: Accounts List */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <AccountList accounts={accounts} isLoading={isLoading} />
        </section>
      </div>
    </div>
  );
}
