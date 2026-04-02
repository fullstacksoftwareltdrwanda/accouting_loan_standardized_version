"use client";

import React from "react";
import { 
  UserPlus, 
  ChevronLeft, 
  Save, 
  MapPin, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  FileText,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Link from "next/link";

export const AddCustomerForm = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-blue-600 uppercase">
            Add New Customer
          </h1>
          <p className="text-[13px] text-zinc-500 font-medium italic italic">
            Manually register a customer for MoneyTap Ecosystem
          </p>
        </div>
        <Link href="/customers">
          <Button variant="outline" className="text-[11px] font-black uppercase tracking-wider gap-2 h-10 border-zinc-200">
            <ChevronLeft className="h-4 w-4" />
            Back to Customers
          </Button>
        </Link>
      </div>

      {/* Main Registration Form */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-500/5 overflow-hidden">
        {/* Section Header */}
        <div className="bg-[#2563eb] px-6 py-4 text-white flex items-center justify-between border-b border-blue-700/30 shadow-lg shadow-blue-500/10">
            <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5" />
                <span className="text-[12px] font-black uppercase tracking-[0.15em]">Manual Registration</span>
            </div>
        </div>

        <form className="p-10 space-y-12">
            {/* 1. BASIC INFORMATION */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                    <span className="text-[13px] font-black uppercase tracking-widest text-blue-600">Basic Information</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Full Name <span className="text-rose-500">*</span></Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 focus:bg-white transition-all rounded-xl" placeholder="Full Name" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">ID Number <span className="text-rose-500">*</span></Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 focus:bg-white transition-all rounded-xl" placeholder="ID Number" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Phone <span className="text-rose-500">*</span></Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 focus:bg-white transition-all rounded-xl" placeholder="Phone" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Email</Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 focus:bg-white transition-all rounded-xl" placeholder="Email" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Gender</Label>
                        <Select defaultValue="male">
                            <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl font-medium text-zinc-600 uppercase text-[11px] font-black tracking-widest">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Date of Birth</Label>
                        <Input type="date" className="h-11 border-zinc-200 bg-zinc-50/20 focus:bg-white transition-all rounded-xl font-medium text-zinc-500" />
                    </div>
                    <div className="space-y-2">
                        < Label className="text-[11px] font-black uppercase text-zinc-400">Record Date <span className="text-rose-500">*</span></Label>
                        <div className="flex items-center gap-2">
                            <Input value="04/02/2026" readOnly className="h-11 border-zinc-200 bg-zinc-100/50 rounded-xl font-mono text-zinc-500 text-[12px] font-bold" />
                        </div>
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Occupation</Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Occupation" />
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Account Number</Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl font-mono" placeholder="Account Number" />
                    </div>
                </div>
            </div>

            {/* 2. CURRENT RESIDENCE */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                    <span className="text-[13px] font-black uppercase tracking-widest text-blue-600">Current Residence</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Province</Label>
                        <Select>
                            <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kigali">Kigali City</SelectItem>
                                <SelectItem value="north">North</SelectItem>
                                <SelectItem value="south">South</SelectItem>
                                <SelectItem value="east">East</SelectItem>
                                <SelectItem value="west">West</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">District</Label>
                        <Select disabled>
                            <SelectTrigger className="h-11 border-zinc-200 bg-zinc-100 rounded-xl text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                                <SelectValue placeholder="Select Province first" />
                            </SelectTrigger>
                            <SelectContent></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Sector</Label>
                        <Select disabled>
                            <SelectTrigger className="h-11 border-zinc-200 bg-zinc-100 rounded-xl text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                                <SelectValue placeholder="Select District first" />
                            </SelectTrigger>
                            <SelectContent></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Cell</Label>
                        <Select disabled>
                            <SelectTrigger className="h-11 border-zinc-200 bg-zinc-100 rounded-xl text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                                <SelectValue placeholder="Select Sector first" />
                            </SelectTrigger>
                            <SelectContent></SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-full space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Street / Address</Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Street / Address" />
                    </div>
                </div>
            </div>

            {/* 3. FAMILY & MARITAL INFORMATION */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                    <span className="text-[13px] font-black uppercase tracking-widest text-blue-600">Family & Marital Information</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Father's Name</Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Father's Name" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Mother's Name</Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Mother's Name" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Marital Status</Label>
                        <Select defaultValue="single">
                            <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl font-medium text-zinc-700">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="divorced">Divorced</SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* 4. GUARANTOR INFORMATION */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                    <span className="text-[13px] font-black uppercase tracking-widest text-blue-600">Guarantor Information</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Has Guarantor?</Label>
                        <Select defaultValue="no">
                            <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl font-medium text-zinc-700 uppercase text-[11px] font-black tracking-widest">
                                <SelectValue placeholder="Select No/Yes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no">No</SelectItem>
                                <SelectItem value="yes">Yes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* 5. LOAN INFORMATION */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                    <span className="text-[13px] font-black uppercase tracking-widest text-blue-600">Loan Information</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Type of Loan</Label>
                        <Select>
                            <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl text-zinc-400 text-[11px] font-bold uppercase">
                                <SelectValue placeholder="Select Loan Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="business">Business Loan</SelectItem>
                                <SelectItem value="personal">Personal Loan</SelectItem>
                                <SelectItem value="salary">Salary Advance</SelectItem>
                                <SelectItem value="asset">Asset Finance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Project (if applicable)</Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Project Name" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Project Location</Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Project Location" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Collateral Location</Label>
                        <Input className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Collateral Location" />
                    </div>
                </div>
            </div>

            {/* 6. SUPPORTING DOCUMENTS */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                    <span className="text-[13px] font-black uppercase tracking-widest text-blue-600">Supporting Documents</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {[
                        "National ID", 
                        "Work Contract", 
                        "Bank Statement", 
                        "Payslip", 
                        "Marital Status Certificate", 
                        "RDB Certificate"
                    ].map((docLabel) => (
                        <div key={docLabel} className="space-y-2 group">
                             <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                                <FileText className="h-3 w-3" />
                                {docLabel}
                             </Label>
                             <div className="flex items-center gap-4">
                                <Button type="button" variant="outline" className="h-11 flex-1 border-dashed border-zinc-200 bg-zinc-50/40 rounded-xl group-hover:border-blue-300 group-hover:bg-blue-50 transition-all font-black text-zinc-400 uppercase text-[10px] tracking-widest gap-3 shadow-sm active:scale-95">
                                    <Upload className="h-4 w-4" />
                                    Choose file
                                </Button>
                                <span className="text-[10px] font-medium text-zinc-300 italic">No file chosen</span>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-10 border-t border-zinc-100 flex items-center justify-between">
                <Link href="/customers">
                    <Button type="button" variant="secondary" className="h-12 px-10 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all">
                        Cancel
                    </Button>
                </Link>
                <Button type="button" className="h-12 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] gap-3 shadow-xl shadow-blue-500/20 active:scale-95 transition-all animate-pulse hover:animate-none">
                    <Save className="h-4 w-4" />
                    Save Customer
                </Button>
            </div>
        </form>
      </div>
      <div className="flex justify-center pb-8 opacity-40">
        <p className="text-[11px] font-medium text-zinc-500">ALMS High-Fidelity Manual Registration | Verified Ecosystem Standards</p>
      </div>
    </div>
  );
};
