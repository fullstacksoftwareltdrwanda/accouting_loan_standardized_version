"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  HandCoins, 
  Search, 
  Filter, 
  RotateCcw,
  Calendar as CalendarIcon
} from "lucide-react";
import { Loan } from "@/types/loan";
import { getLoans } from "@/services/mock/loan.service";
import { DataTable } from "@/components/table/data-table";
import { loanColumns, getLoanActions } from "./loan-columns";
import { LoanStats } from "./loan-stats";
import { LoanStatusFilter } from "./loan-status-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function LoanList() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load loans
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLoans();
        setLoans(data);
        setFilteredLoans(data);
      } catch (error) {
        console.error("Failed to load loans", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...loans];
    
    if (activeTab !== "all") {
      result = result.filter(l => l.status === activeTab);
    }
    
    if (searchQuery) {
      result = result.filter(l => 
        l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.loanNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredLoans(result);
  }, [activeTab, searchQuery, loans]);

  const counts = {
    all: loans.length,
    active: loans.filter(l => l.status === "active").length,
    overdue: loans.filter(l => l.status === "overdue").length,
    suspended: loans.filter(l => l.status === "suspended").length,
    closed: loans.filter(l => l.status === "closed").length,
    paid: loans.filter(l => l.status === "paid").length,
    unpaid: loans.filter(l => l.status === "unpaid").length,
  };

  const actions = getLoanActions(
    (ln) => router.push(`/loans/${ln.id}`),
    (ln) => router.push(`/loans/edit/${ln.id}`), // Placeholder for edit
    (ln) => {
      if (confirm(`Are you sure you want to delete ${ln.loanNumber}?`)) {
        setLoans(prev => prev.filter(item => item.id !== ln.id));
      }
    }
  );

  const columns = loanColumns(actions);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tight text-blue-600 uppercase">
          Loan Portfolio
        </h2>
        <p className="text-[13px] text-zinc-500 font-medium italic">
          Manage your loan portfolio
        </p>
      </div>

      {/* Date Filters Bar */}
      <div className="flex flex-wrap items-end gap-4 p-6 bg-white rounded-3xl border border-zinc-200 shadow-sm dark:bg-zinc-950/40">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Start Date</label>
          <div className="relative">
            <Input type="date" defaultValue="2025-01-01" className="h-10 w-44 rounded-xl border-zinc-200 bg-zinc-50/50" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">End Date</label>
          <div className="relative">
            <Input type="date" defaultValue="2026-04-02" className="h-10 w-44 rounded-xl border-zinc-200 bg-zinc-50/50" />
          </div>
        </div>
        <Button className="bg-[#2563eb] hover:bg-blue-700 h-10 rounded-xl font-black uppercase text-[11px] tracking-widest gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="h-10 rounded-xl font-black uppercase text-[11px] tracking-widest gap-2 border-zinc-200 active:scale-95 transition-all">
          Reset
        </Button>
        <div className="ml-auto pb-2">
           <span className="text-[11px] text-zinc-400 font-medium italic">
             Showing loans disbursed: <span className="text-zinc-600 font-bold italic">01 Jan 2025 – 02 Apr 2026</span>
           </span>
        </div>
      </div>

      {/* Summary Stats */}
      <LoanStats loans={loans} />

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <LoanStatusFilter 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          counts={counts}
        />
        
        <div className="flex items-center gap-3">
          <div className="relative grow md:grow-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search loans..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full md:w-72 pl-10 pr-4 rounded-xl border-zinc-200 bg-white"
            />
          </div>
          <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg active:scale-95 transition-all">
             <Search className="h-5 w-5" />
          </Button>
          <Button 
            onClick={() => router.push("/loans/new")}
            className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[11px] tracking-widest gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5" />
            New
          </Button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50">
           <h3 className="text-sm font-black uppercase tracking-widest text-[#2563eb]">Loan Portfolio</h3>
           <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-black rounded-lg">
             {filteredLoans.length} Loans
           </Badge>
        </div>
        <div className="p-0">
          <DataTable 
            columns={columns} 
            data={filteredLoans} 
            isLoading={isLoading} 
            emptyStateTitle="No Loans Recorded"
            emptyStateDescription="Your loan portfolio is currently empty. Start by creating the first loan application for a customer."
            emptyStateAction={
              <Button 
                onClick={() => router.push("/loans/new")}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[12px] tracking-widest gap-3 shadow-xl shadow-blue-500/20"
              >
                <Plus className="h-5 w-5" />
                Create Your First Loan
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
