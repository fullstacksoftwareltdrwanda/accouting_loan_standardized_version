"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import { Customer } from "@/types/customer";
import { getCustomers } from "@/services/customer.service";
import { DataTable } from "@/components/table/data-table";
import { customerColumns } from "./customer-columns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CustomerList() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCustomers();
        // The service returns { customers, meta }
        setCustomers(data.customers as Customer[]);
      } catch (err: any) {
        console.error("Failed to load customers", err);
        setError(err.message || "An unexpected error occurred while fetching members.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredCustomers = customers.filter(c => 
    (c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (c.memberNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (c.phone?.includes(searchQuery) ?? false)
  );

  const actions = [
    {
      label: "View Profile",
      icon: Users,
      onClick: (c: Customer) => router.push(`/customers/${c.id}`),
    },
    {
      label: "Edit Member",
      onClick: (c: Customer) => router.push(`/customers/edit/${c.id}`),
    },
    {
      label: "Delete",
      variant: "danger" as const,
      onClick: (c: Customer) => {
        if(confirm(`Remove ${c.name}?`)) {
           // TODO: Delete via service
        }
      },
    }
  ];

  const columns = customerColumns(actions);

  return (
    <div className="space-y-8 animate-float-in">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Members Directory
          </h1>
          <p className="text-[13px] text-[var(--text-tertiary)]">
            Manage borrower profiles and contact information
          </p>
        </div>
        <Button 
          onClick={() => router.push("/customers/add")}
          className="h-10 px-5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl font-medium text-[13px] gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">All Members</h3>
          <span className="text-[12px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-sunken)] px-3 py-1 rounded-lg">
            {filteredCustomers.length} members
          </span>
        </div>
        <DataTable 
          columns={columns} 
          data={filteredCustomers} 
          isLoading={isLoading} 
          filterColumn="name"
          filterPlaceholder="Search members by name..."
          emptyStateTitle="No Members Found"
          emptyStateDescription="Your member directory is empty. Start by adding your first borrower."
          emptyStateAction={
            <Button 
              onClick={() => router.push("/customers/add")}
              className="h-10 px-6 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl font-medium text-[13px] gap-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add First Member
            </Button>
          }
        />
      </div>
    </div>
  );
}
