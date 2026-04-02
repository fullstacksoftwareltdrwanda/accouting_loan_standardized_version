"use client";

import React from "react";
import { 
  KeyRound, 
  ShieldCheck, 
  Monitor, 
  Smartphone, 
  Lock,
  ChevronRight,
  ArrowRight,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SecuritySettings() {
  return (
    <div className="bg-white rounded-[40px] border border-zinc-200 shadow-2xl shadow-zinc-200/50 p-10 dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none animate-in fade-in slide-in-from-right-4 duration-1000">
      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-zinc-100">
         <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm border border-rose-100">
            <Lock className="h-5 w-5" />
         </div>
         <div className="space-y-1">
            <h4 className="text-xl font-black text-[#1a365d] dark:text-blue-400 leading-tight uppercase tracking-tight">Security & Access</h4>
            <p className="text-[12px] text-zinc-400 font-medium italic">Manage your password, 2FA, and authorized devices.</p>
         </div>
      </div>

      <div className="space-y-10">
        {/* 2FA Toggle */}
        <div className="flex items-center justify-between p-6 rounded-3xl bg-zinc-50 border border-zinc-100 transition-all hover:border-zinc-200 group">
           <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                 <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                 <h5 className="text-[13px] font-black text-zinc-900 uppercase">Two-Factor Authentication</h5>
                 <p className="text-[11px] text-zinc-500 font-medium leading-relaxed italic">Add an extra layer of security to your account.</p>
              </div>
           </div>
           <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
        </div>

        {/* Password Update */}
        <div className="space-y-6">
           <div className="flex items-center gap-2 px-1">
              <KeyRound className="h-4 w-4 text-zinc-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#1a365d]">Update Password</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">New Password</Label>
                 <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50 text-[13px] font-bold" />
              </div>
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Confirm New Password</Label>
                 <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50 text-[13px] font-bold" />
              </div>
           </div>
           <Button variant="outline" className="h-12 px-6 rounded-xl border-zinc-200 text-[11px] font-black uppercase tracking-widest gap-2 hover:bg-zinc-50 active:scale-95 transition-all">
             Set New Password
             <ArrowRight className="h-3.5 w-3.5" />
           </Button>
        </div>

        {/* Authorized Devices */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 px-1">
              <Activity className="h-4 w-4 text-zinc-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#1a365d]">Recent Login Activity</span>
           </div>
           <div className="space-y-3">
              {[
                { device: "MacBook Pro 16", os: "macOS 14.2", location: "Kigali, Rwanda", icon: Monitor, status: "Current Session" },
                { device: "iPhone 15 Pro", os: "iOS 17.1", location: "Kigali, Rwanda", icon: Smartphone, status: "2 hours ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-3xl border border-zinc-100 bg-white shadow-sm hover:border-zinc-200 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                         <item.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                         <h6 className="text-[12px] font-bold text-zinc-900">{item.device} • {item.os}</h6>
                         <p className="text-[10px] text-zinc-500 font-medium italic">{item.location}</p>
                      </div>
                   </div>
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                     item.status === "Current Session" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-zinc-50 text-zinc-400 border-zinc-100"
                   )}>
                     {item.status}
                   </span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
