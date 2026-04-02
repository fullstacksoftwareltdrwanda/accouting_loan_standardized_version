"use client";

import React from "react";
import { User, Mail, Phone, Building2, Save, FileEdit } from "lucide-react";
import { UserProfile } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PersonalInfoForm({ user }: { user: UserProfile }) {
  return (
    <div className="bg-white rounded-[40px] border border-zinc-200 shadow-2xl shadow-zinc-200/50 p-10 dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-zinc-100">
         <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <FileEdit className="h-5 w-5" />
         </div>
         <div className="space-y-1">
            <h4 className="text-xl font-black text-[#1a365d] dark:text-blue-400 leading-tight uppercase tracking-tight">Personal Information</h4>
            <p className="text-[12px] text-zinc-400 font-medium italic">Manage your account details and contact information.</p>
         </div>
      </div>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3 pt-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
                <Input defaultValue={user.name} className="h-14 pl-12 pr-6 rounded-2xl border-zinc-100 bg-zinc-50/50 text-[13px] font-bold focus:bg-white focus:shadow-xl transition-all" />
              </div>
           </div>
           <div className="space-y-3 pt-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
                <Input defaultValue={user.email} className="h-14 pl-12 pr-6 rounded-2xl border-zinc-100 bg-zinc-50/50 text-[13px] font-bold focus:bg-white focus:shadow-xl transition-all" />
              </div>
           </div>
           <div className="space-y-3 pt-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number</Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
                <Input defaultValue={user.phone} className="h-14 pl-12 pr-6 rounded-2xl border-zinc-100 bg-zinc-50/50 text-[13px] font-bold focus:bg-white focus:shadow-xl transition-all" />
              </div>
           </div>
           <div className="space-y-3 pt-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Department</Label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
                <Input defaultValue={user.department} className="h-14 pl-12 pr-6 rounded-2xl border-zinc-100 bg-zinc-50/50 text-[13px] font-bold focus:bg-white focus:shadow-xl transition-all disabled:opacity-70" disabled />
              </div>
           </div>
        </div>

        <div className="pt-10 flex items-center justify-end border-t border-zinc-100">
           <Button className="h-14 px-10 rounded-[20px] bg-[#1a365d] hover:bg-blue-900 text-white font-black uppercase text-[12px] tracking-widest gap-3 shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
             <Save className="h-5 w-5" />
             Save Changes
           </Button>
        </div>
      </form>
    </div>
  );
}
