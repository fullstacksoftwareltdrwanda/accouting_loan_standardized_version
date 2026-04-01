import React from "react";
import { ReportGrid } from "@/components/reports/report-grid";

export const metadata = {
  title: "Financial Reports & Export Hub | ALMS",
  description: "Generate and download standardized financial and operational data.",
};

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <ReportGrid />
    </div>
  );
}
