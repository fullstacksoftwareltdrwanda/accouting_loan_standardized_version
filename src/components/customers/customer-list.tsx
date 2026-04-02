"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  ArrowUpRight,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Customer } from "@/types/customer";

export const CustomerList = () => {
  const [showAll, setShowAll] = useState(false);

  // Mock data matching the screenshot
  const customers: Customer[] = [
    {
      id: "1",
      memberNumber: "GLS-001",
      code: "CUST-31/03/26/09/34/37",
      name: "Test User",
      phone: "0786679654",
      email: "willy@fullstack.rw",
      idNumber: "15151515151515",
      status: "APPROVED",
      gender: "Male",
      dateOfBirth: "1990-01-01",
      recordDate: "04/02/2026",
      occupation: "Software Engineer",
      accountNumber: "123456789",
      province: "Kigali",
      district: "Nyarugenge",
      sector: "Nyarugenge",
      cell: "Kiyovu",
      streetAddress: "KN 1 St",
      fatherName: "John Doe",
      motherName: "Jane Doe",
      maritalStatus: "Single",
      hasGuarantor: false
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-blue-600 uppercase">
          All Approved Members
        </h1>
        <p className="text-[13px] text-zinc-500 font-medium italic">
          Manage active members and view their full history.
        </p>
      </div>

      {/* Directory Controls */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-500/5 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search members..." 
              className="pl-11 h-11 border-zinc-200 bg-zinc-50/10 focus:bg-white transition-all rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4 px-3 py-2 bg-zinc-50/50 rounded-lg border border-zinc-100">
               <label className="text-[11px] font-black uppercase text-zinc-400 cursor-pointer">
                  Show All (Incl. Pending/Rejected)
               </label>
               <input 
                  type="checkbox" 
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
               />
            </div>
            
            <Link href="/customers/add">
                <Button className="bg-[#2563eb] hover:bg-blue-700 text-white font-black uppercase tracking-wider text-[11px] h-11 px-6 rounded-xl gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    <Plus className="h-4 w-4" />
                    Add Manually
                </Button>
            </Link>
          </div>
        </div>

        {/* Member Directory Table */}
        <div className="space-y-4">
            <h3 className="text-[12px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                Member Directory
            </h3>
            
            <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-blue-50/50 border-b border-zinc-200 text-[10px] font-black uppercase tracking-[0.15em] text-[#64748b]">
                            <th className="px-6 py-4 text-blue-600">Member #</th>
                            <th className="px-4 py-4 min-w-[200px]">Code</th>
                            <th className="px-4 py-4">Name</th>
                            <th className="px-4 py-4">Phone/Email</th>
                            <th className="px-4 py-4">ID Number</th>
                            <th className="px-4 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-zinc-50/80 transition-all group">
                                <td className="px-6 py-4">
                                    <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-200 border-none px-3 py-1 text-[11px] font-black rounded-lg">
                                        {customer.memberNumber}
                                    </Badge>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[11px] font-black text-zinc-500 uppercase tracking-tighter truncate w-32">
                                            {customer.code}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[12px] font-black text-zinc-700">{customer.name}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-zinc-800">{customer.phone}</span>
                                        <span className="text-[10px] font-medium text-zinc-400 lowercase">{customer.email}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-[11px] font-mono font-bold text-zinc-400 tracking-wider">
                                    {customer.idNumber}
                                </td>
                                <td className="px-4 py-4">
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-4 py-1 text-[10px] font-black rounded-full">
                                        {customer.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 bg-zinc-100 hover:bg-zinc-200 rounded-lg">
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      <div className="flex justify-center pb-8 opacity-40">
        <p className="text-[11px] font-medium text-zinc-500">ALMS Member Management System | Connected to National Registry (KYC Bypassed)</p>
      </div>
    </div>
  );
};
