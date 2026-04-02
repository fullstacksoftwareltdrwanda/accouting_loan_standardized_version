"use client";

import React from "react";

interface ReportHeaderBannerProps {
  title: string;
  periodLabel: string;
  isLandscape?: boolean;
}

export const ReportHeaderBanner = ({ title, periodLabel, isLandscape = false }: ReportHeaderBannerProps) => {
  return (
    <div className={`w-full bg-[#7a6fcc] text-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2 text-center my-6 ${isLandscape ? 'min-h-[220px]' : 'min-h-[160px]'}`}>
        <h2 className="text-xl font-bold tracking-wide uppercase opacity-90 italic">Accounting & Loan Management System</h2>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <div className="h-0.5 w-16 bg-white/20 my-2" />
        <p className="text-sm font-medium opacity-80 uppercase tracking-widest">{periodLabel}</p>
    </div>
  );
};
