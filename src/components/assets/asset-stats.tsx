"use client";

import React from "react";
import { Package, TrendingDown, Wallet, LayoutGrid } from "lucide-react";
import { Asset } from "@/types/asset";

interface AssetStatsSectionProps {
  assets: Asset[];
}

export const AssetStatsSection = ({ assets }: AssetStatsSectionProps) => {
  const totalAssets = assets.length;
  const activeAssets = assets.filter((a) => a.status === "active").length;
  const disposedAssets = totalAssets - activeAssets;
  
  const totalAcquisition = assets.reduce((sum, a) => sum + (a.value || 0), 0);
  const totalBookValue = assets.reduce((sum, a) => sum + (a.bookValue || 0), 0);
  const totalAccumDep = assets.reduce((sum, a) => sum + (a.accumDep || 0), 0);

  const stats = [
    {
      title: "Total Assets",
      value: totalAssets.toString(),
      borderColor: "border-blue-500",
      textColor: "text-blue-600",
      icon: LayoutGrid,
      badges: [
        { label: "Active", value: activeAssets, color: "bg-emerald-500" },
        { label: "Disposed", value: disposedAssets, color: "bg-rose-500" },
      ]
    },
    {
      title: "Total Acquisition Value",
      value: `Rwf ${totalAcquisition.toLocaleString()}`,
      borderColor: "border-emerald-500",
      textColor: "text-emerald-600",
      icon: Package,
    },
    {
      title: "Current Book Value",
      value: `Rwf ${totalBookValue.toLocaleString()}`,
      borderColor: "border-cyan-500",
      textColor: "text-cyan-600",
      icon: Wallet,
    },
    {
      title: "Accumulated Depreciation",
      value: `Rwf ${totalAccumDep.toLocaleString()}`,
      borderColor: "border-amber-400",
      textColor: "text-amber-500",
      icon: TrendingDown,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div 
            key={stat.title} 
            className={`bg-white p-5 rounded-xl border-2 ${stat.borderColor} shadow-sm space-y-4 min-h-[140px] flex flex-col justify-between`}
        >
          <div className="space-y-1">
            <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">{stat.title}</p>
            <p className={`text-2xl font-black ${stat.textColor}`}>{stat.value}</p>
          </div>
          
          {stat.badges ? (
            <div className="flex gap-2">
                {stat.badges.map(b => (
                    <div key={b.label} className={`${b.color} px-2 py-0.5 rounded text-[10px] font-black text-white uppercase`}>
                        {b.label}: {b.value}
                    </div>
                ))}
            </div>
          ) : (
             <div className="flex justify-end opacity-20">
                <stat.icon className="h-10 w-10" />
             </div>
          )}
        </div>
      ))}
    </div>
  );
};
