"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
} from "lucide-react";
import { Loan } from "@/types/loan";
import { getLoans } from "@/services/mock/loan.service";
import { DataTable } from "@/components/table/data-table";
import { loanColumns, getLoanActions } from "./loan-columns";
import { LoanStats } from "./loan-stats";
import { LoanStatusFilter } from "./loan-status-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function LoanList() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
    (ln) => router.push(`/loans/edit/${ln.id}`),
    (ln) => {
      if (confirm(`Are you sure you want to delete ${ln.loanNumber}?`)) {
        setLoans(prev => prev.filter(item => item.id !== ln.id));
      }
    }
  );

  const columns = loanColumns(actions);

  return (
    <div className="space-y-8 animate-float-in">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Loan Portfolio
          </h1>
          <p className="text-[13px] text-[var(--text-tertiary)]">
            Manage and monitor your active loan portfolio
          </p>
        </div>
        <Button 
          onClick={() => router.push("/loans/new")}
          className="h-10 px-5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl font-medium text-[13px] gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New Loan
        </Button>
      </div>

      {/* Date Filters */}
      <div className="flex flex-wrap items-end gap-4 p-5 bg-white rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)]">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Start Date</label>
          <Input type="date" defaultValue="2025-01-01" className="h-9 w-40 rounded-xl border-[var(--border-default)] text-[13px]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">End Date</label>
          <Input type="date" defaultValue="2026-04-02" className="h-9 w-40 rounded-xl border-[var(--border-default)] text-[13px]" />
        </div>
        <Button className="h-9 px-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl text-[12px] font-medium gap-2 transition-all">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </Button>
        <Button variant="outline" className="h-9 px-4 rounded-xl text-[12px] font-medium border-[var(--border-default)] text-[var(--text-secondary)]">
          Reset
        </Button>
      </div>

      {/* Summary Stats */}
      <LoanStats loans={loans} />

      {/* Filters and Search */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <LoanStatusFilter 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          counts={counts}
        />
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-disabled)]" />
            <Input 
              placeholder="Search loans..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-64 pl-9 rounded-xl border-[var(--border-default)] text-[13px]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">Portfolio</h3>
          <span className="text-[12px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-sunken)] px-3 py-1 rounded-lg">
            {filteredLoans.length} loans
          </span>
        </div>
        <DataTable 
          columns={columns} 
          data={filteredLoans} 
          isLoading={isLoading} 
          emptyStateTitle="No Loans Recorded"
          emptyStateDescription="Your loan portfolio is currently empty. Start by creating the first loan application."
          emptyStateAction={
            <Button 
              onClick={() => router.push("/loans/new")}
              className="h-10 px-6 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl font-medium text-[13px] gap-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Create First Loan
            </Button>
          }
        />
      </div>
    </div>
  );
}
