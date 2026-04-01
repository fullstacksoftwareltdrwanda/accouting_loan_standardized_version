"use client";

import React from "react";
import { Calendar, Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LedgerFilters() {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800 space-y-6">
      <div className="flex items-center gap-2 mb-4 text-zinc-800 dark:text-zinc-200">
        <Calendar className="w-5 h-5" />
        <h3 className="text-lg font-bold">Time Frame Filter</h3>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Button variant="default" className="rounded-full h-8 text-xs bg-blue-600 hover:bg-blue-700">Date Range</Button>
        <Button variant="outline" className="rounded-full h-8 text-xs">By Month</Button>
        <Button variant="outline" className="rounded-full h-8 text-xs">By Day</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-3 space-y-2">
          <label className="text-sm font-medium text-zinc-500">From Date</label>
          <Input type="date" defaultValue="2026-02-03" className="w-full" />
        </div>
        <div className="md:col-span-3 space-y-2">
          <label className="text-sm font-medium text-zinc-500">To Date</label>
          <Input type="date" defaultValue="2026-04-01" className="w-full" />
        </div>
        <div className="md:col-span-6 space-y-2">
          <label className="text-sm font-medium text-zinc-500">Quick Select</label>
          <div className="flex flex-wrap gap-2">
            {["Today", "Yesterday", "This Week", "This Month", "Last Month", "This Year"].map((item) => (
              <Button key={item} variant="outline" className="h-10 text-xs px-3 bg-zinc-50/50 hover:bg-zinc-100 dark:bg-zinc-900">
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mt-4">
        <div className="md:col-span-4 space-y-2">
          <label className="text-sm font-medium text-zinc-500">Voucher Number</label>
          <Input placeholder="Search voucher..." className="w-full" />
        </div>
        <div className="md:col-span-4 space-y-2">
          <label className="text-sm font-medium text-zinc-500">Account</label>
          <Input placeholder="Account code or name..." className="w-full" />
        </div>
        <div className="md:col-span-4 flex items-center gap-3">
          <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 font-semibold shadow-md active:scale-95">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filter
          </Button>
          <Button variant="outline" className="h-10 px-6 font-semibold shadow-sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
