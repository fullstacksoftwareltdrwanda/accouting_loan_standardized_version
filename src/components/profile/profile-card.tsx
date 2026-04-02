"use client";

import React from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Calendar,
  Camera,
  Activity,
  UserCheck
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProfileCard({ user }: { user: UserProfile }) {
  return (
    <div className="bg-white rounded-[40px] border border-zinc-200 shadow-2xl shadow-zinc-200/50 overflow-hidden dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none animate-in fade-in slide-in-from-left-4 duration-700">
      {/* Banner/Header */}
      <div className="h-32 bg-gradient-to-r from-[#1a365d] to-blue-600 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      {/* Avatar Section */}
      <div className="px-8 pb-8 -mt-16 relative">
        <div className="relative inline-block group">
           <div className="h-32 w-32 rounded-[40px] border-4 border-white bg-zinc-100 flex items-center justify-center overflow-hidden shadow-xl dark:border-zinc-900">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-blue-600">{user.name.charAt(0)}</span>
              )}
           </div>
           <button className="absolute bottom-2 right-2 h-10 w-10 rounded-2xl bg-white shadow-lg border border-zinc-100 flex items-center justify-center text-zinc-500 hover:text-blue-600 transition-all active:scale-95 group-hover:bg-blue-50">
             <Camera className="h-5 w-5" />
           </button>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black tracking-tight text-[#1a365d] dark:text-blue-400 capitalize">
                  {user.name}
                </h3>
                <Badge variant="default" className="bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full border-none shadow-lg shadow-blue-500/20">
                  {user.role}
                </Badge>
              </div>
              <p className="text-[13px] text-zinc-500 font-medium italic">
                {user.department} — Senior Management Authorization
              </p>
           </div>

           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[11px] font-black uppercase tracking-widest">Ecosystem Active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
                 <UserCheck className="h-3.5 w-3.5" />
                 <span className="text-[11px] font-black uppercase tracking-widest italic">Verified Account</span>
              </div>
           </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { label: "Email Address", value: user.email, icon: Mail },
             { label: "Phone Number", value: user.phone, icon: Phone },
             { label: "Location", value: "Rwanda, Kigali", icon: MapPin },
             { label: "Joined Date", value: user.joinedDate, icon: Calendar },
           ].map((item, i) => (
             <div key={i} className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-1 transition-all hover:border-zinc-200 group">
                <div className="flex items-center gap-2 text-zinc-400 group-hover:text-blue-500 transition-colors">
                   <item.icon className="h-3.5 w-3.5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
                <p className="text-[12px] font-bold text-zinc-700 dark:text-zinc-300 truncate">{item.value}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
