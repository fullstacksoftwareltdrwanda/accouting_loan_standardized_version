"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Customer } from "@/types/customer";
import { getCustomers } from "@/services/mock/customer.service";
import { DataTable } from "@/components/table/data-table";
import { customerColumns } from "./customer-columns";

export const CustomerList = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to load customers", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.memberNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-blue-600 uppercase">
          Approved Members
        </h1>
        <p className="text-[13px] text-zinc-500 font-medium italic">
          Manage active members and view their full history.
        </p>
      </div>

      {/* Directory Controls */}
      <div className="bg-white rounded-[40px] border border-zinc-200 shadow-2xl shadow-zinc-500/5 p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search members by name, number or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 border-zinc-200 bg-zinc-50/10 focus:bg-white transition-all rounded-2xl text-[13px] font-bold"
            />
          </div>

          <div className="flex items-center gap-4">
             <Button 
                onClick={() => router.push("/customers/add")}
                className="bg-[#2563eb] hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] h-14 px-8 rounded-[20px] gap-3 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
             >
                <Plus className="h-5 w-5" />
                Add New Member
             </Button>
          </div>
        </div>

        {/* Member Directory Table */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                   Member Directory
               </h3>
               <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-4 py-1 text-[10px] font-black rounded-full">
                  {filteredCustomers.length} Total
               </Badge>
            </div>
            
            <div className="overflow-hidden">
                <DataTable 
                  columns={columns} 
                  data={filteredCustomers} 
                  isLoading={isLoading}
                  emptyStateTitle="No Members Found"
                  emptyStateDescription="Your member registry is currently empty. Add your first customer to begin managing their loans."
                  emptyStateAction={
                    <Button 
                      onClick={() => router.push("/customers/add")}
                      className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[12px] tracking-widest gap-3 shadow-xl shadow-blue-500/20"
                    >
                      <Plus className="h-5 w-5" />
                      Add Your First Member
                    </Button>
                  }
                />
            </div>
        </div>
      </div>

      <div className="flex justify-center pb-8 opacity-40">
        <p className="text-[11px] font-medium text-zinc-500">ALMS Member Management System | Production Ready Skeleton</p>
      </div>
    </div>
  );
};
