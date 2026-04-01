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
    <div className="animate-in fade-in duration-500">
      <div className="max-w-[1440px] mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-800">
              General Ledger
            </h2>
            <p className="text-[12px] text-zinc-400">
              Manage timeline filters, add manual journal entries, and view unified ledger records.
            </p>
          </div>
        </div>

        {/* Top Filters */}
        <LedgerFilters />

        {/* Middle Section: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-8 flex flex-col h-full">
            <ManualJournalEntry />
          </div>
          <div className="lg:col-span-4 flex flex-col h-full">
            <RecentEntries />
          </div>
        </div>

        {/* Bottom: Full View Table */}
        <GeneralLedgerTable />
      </div>
    </div>
  );
}
