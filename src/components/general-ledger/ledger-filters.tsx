"use client";

import React from "react";
import { Calendar, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LedgerFilters() {
  return (
    <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-zinc-700">
        <Calendar className="w-4 h-4" />
        <h3 className="text-sm font-semibold">Time Frame Filter</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5">
        <Button variant="default" className="rounded-full h-7 text-[11px] bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Date Range</Button>
        <Button variant="outline" className="rounded-full h-7 text-[11px] w-full sm:w-auto">By Month</Button>
        <Button variant="outline" className="rounded-full h-7 text-[11px] w-full sm:w-auto">By Day</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-1 lg:col-span-3 space-y-1">
          <label className="text-[11px] font-medium text-zinc-400">From Date</label>
          <Input type="date" defaultValue="2026-02-03" className="h-8 text-[12px]" />
        </div>
        <div className="sm:col-span-1 lg:col-span-3 space-y-1">
          <label className="text-[11px] font-medium text-zinc-400">To Date</label>
          <Input type="date" defaultValue="2026-04-01" className="h-8 text-[12px]" />
        </div>
        <div className="sm:col-span-2 lg:col-span-6 space-y-1">
          <label className="text-[11px] font-medium text-zinc-400">Quick Select</label>
          <div className="flex flex-wrap gap-1.5">
            {["Today", "Yesterday", "This Week", "This Month", "Last Month", "This Year"].map((item) => (
              <Button key={item} variant="outline" className="h-8 text-[11px] px-2.5 border-zinc-200">
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-1 lg:col-span-4 space-y-1">
          <label className="text-[11px] font-medium text-zinc-400">Voucher Number</label>
          <Input placeholder="Search voucher..." className="h-8 text-[12px]" />
        </div>
        <div className="sm:col-span-1 lg:col-span-4 space-y-1">
          <label className="text-[11px] font-medium text-zinc-400">Account</label>
          <Input placeholder="Account code or name..." className="h-8 text-[12px]" />
        </div>
        <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-2">
          <Button className="h-8 px-4 bg-blue-600 hover:bg-blue-700 font-medium shadow-sm text-[12px] flex-1 sm:flex-none">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Apply
          </Button>
          <Button variant="outline" className="h-8 px-4 font-medium text-[12px] flex-1 sm:flex-none">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
