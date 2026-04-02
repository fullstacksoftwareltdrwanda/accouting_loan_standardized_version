"use client";

import React from "react";
import { Package, TrendingDown, Wallet, LayoutGrid } from "lucide-react";
import { Asset } from "@/types/asset";
import { cn } from "@/lib/utils";

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
      icon: LayoutGrid,
      color: "text-blue-600",
      badges: [
        { label: "Active", value: activeAssets, color: "bg-emerald-50 text-emerald-700" },
        { label: "Disposed", value: disposedAssets, color: "bg-rose-50 text-rose-600" },
      ]
    },
    {
      title: "Acquisition Value",
      value: `Rwf ${totalAcquisition.toLocaleString()}`,
      icon: Package,
      color: "text-emerald-600",
    },
    {
      title: "Book Value",
      value: `Rwf ${totalBookValue.toLocaleString()}`,
      icon: Wallet,
      color: "text-teal-600",
    },
    {
      title: "Accumulated Dep.",
      value: `Rwf ${totalAccumDep.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      {stats.map((stat) => (
        <div 
          key={stat.title} 
          className="bg-white p-5 rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] space-y-3 transition-all hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3">
            <stat.icon className={cn("h-5 w-5", stat.color)} />
            <p className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{stat.title}</p>
          </div>
          <p className={cn("text-2xl font-bold tracking-tight", stat.color)}>{stat.value}</p>
          
          {stat.badges && (
            <div className="flex gap-2">
              {stat.badges.map(b => (
                <span key={b.label} className={cn("px-2 py-0.5 rounded-lg text-[10px] font-semibold", b.color)}>
                  {b.label}: {b.value}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
