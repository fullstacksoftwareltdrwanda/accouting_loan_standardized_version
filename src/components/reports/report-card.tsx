"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  RefreshCw, 
  FileSpreadsheet, 
  FileBox, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { Report } from "@/types/report";
import { generateReport, downloadReport } from "@/services/report.service";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  report: Report;
  onUpdate: (updatedReport: Report) => void;
}

export function ReportCard({ report, onUpdate }: ReportCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const updated = await generateReport(report.id);
      onUpdate(updated);
    } catch (error) {
      console.error("Failed to generate", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadReport(report.id);
      // In a real app, this would trigger a file download stream
    } catch (error) {
      console.error("Failed to download", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getFormatIcon = () => {
    switch (report.format) {
      case "CSV":
      case "EXCEL":
        return <FileSpreadsheet className="h-6 w-6 text-emerald-600" />;
      case "PDF":
        return <FileBox className="h-6 w-6 text-rose-600" />;
      default:
        return <FileText className="h-6 w-6 text-indigo-600" />;
    }
  };

  const formattedDate = report.lastGenerated 
    ? format(new Date(report.lastGenerated), "MMM dd, yyyy 'at' HH:mm")
    : "Never";

  return (
    <div className="flex flex-col p-6 rounded-3xl border border-zinc-200 bg-white shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800 transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 group">
      
      {/* Header section with Icon and Category */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 transition-colors group-hover:bg-white dark:group-hover:bg-zinc-950">
          {getFormatIcon()}
        </div>
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
          report.category === "Financial" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" :
          report.category === "Operational" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400" :
          "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" // Compliance
        )}>
          {report.category}
        </span>
      </div>

      {/* Main Info */}
      <div className="flex-1 space-y-1 mb-6">
        <h3 className="font-black text-lg text-zinc-900 dark:text-zinc-50 leading-tight">
          {report.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans line-clamp-2">
          {report.description}
        </p>
      </div>

      {/* Meta info */}
      <div className="flex flex-col gap-1.5 mb-6 text-xs font-sans text-zinc-500">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 opacity-70" />
          <span>Last generated: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{formattedDate}</span></span>
        </div>
        
        {report.size && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Ready for export ({report.size})</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        
        {!report.lastGenerated ? (
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 font-black rounded-xl"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileBox className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? "Building Data..." : "Generate Initial"}
          </Button>
        ) : (
          <>
            <Button 
              variant="outline"
              className="px-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={handleGenerate}
              disabled={isGenerating}
              title="Regenerate data"
            >
              <RefreshCw className={cn("h-4 w-4 text-zinc-500", isGenerating && "animate-spin text-indigo-500")} />
            </Button>

            <Button 
              className="flex-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-black transition-all active:scale-95 shadow-sm"
              onClick={handleDownload}
              disabled={isDownloading || isGenerating}
            >
              <Download className={cn("mr-2 h-4 w-4", isDownloading && "animate-bounce")} />
              {isDownloading ? "Exporting..." : `Download ${report.format}`}
            </Button>
          </>
        )}
      </div>

    </div>
  );
}
