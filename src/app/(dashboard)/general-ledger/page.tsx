import React from "react";
import { LedgerFilters } from "@/components/general-ledger/ledger-filters";
import { ManualJournalEntry } from "@/components/general-ledger/manual-journal-entry";
import { RecentEntries } from "@/components/general-ledger/recent-entries";
import { GeneralLedgerTable } from "@/components/general-ledger/general-ledger-table";

export const metadata = {
  title: "General Ledger | ALMS",
  description: "Manage your General Ledger and manual journal entries.",
};

export default function GeneralLedgerPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
              General Ledger
            </h2>
            <p className="text-zinc-500 font-sans dark:text-zinc-400">
              Manage timeline filters, add manual journal entries, and view unified ledger records.
            </p>
          </div>
        </div>

        {/* Top Filters */}
        <LedgerFilters />

        {/* Middle Section: Split Layout (Manual Entry vs Recent) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          <div className="xl:col-span-8 flex flex-col h-full">
            <div className="flex-1">
              <ManualJournalEntry />
            </div>
          </div>
          <div className="xl:col-span-4 flex flex-col h-full">
            <div className="flex-1">
              <RecentEntries />
            </div>
          </div>
        </div>

        {/* Bottom Section: Full View Table */}
        <GeneralLedgerTable />
      </div>
    </div>
  );
}
