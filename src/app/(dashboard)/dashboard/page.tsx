import React from "react";
import { getDashboardStats } from "@/services/mock/dashboard.service";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default async function DashboardPage() {
  const data = await getDashboardStats();

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <DashboardOverview data={data} />
    </div>
  );
}
