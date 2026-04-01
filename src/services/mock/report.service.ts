import { Report } from "@/types/report";
import { MOCK_REPORTS } from "@/data/mock/reports";

/**
 * Service to manage Financial & Operational Reports.
 * Simulated async backend calls.
 */
export async function getReports(): Promise<Report[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...MOCK_REPORTS].sort((a, b) => {
    // Sort by name
    return a.title.localeCompare(b.title);
  });
}

/**
 * Simulates a long-running report generation process.
 */
export async function generateReport(id: string): Promise<Report> {
  // Simulate 2-4 seconds generation time
  const generationTime = Math.floor(Math.random() * 2000) + 2000;
  await new Promise((resolve) => setTimeout(resolve, generationTime));
  
  const report = MOCK_REPORTS.find(r => r.id === id);
  if (!report) throw new Error("Report not found");

  const updatedReport: Report = {
    ...report,
    status: "ready",
    lastGenerated: new Date().toISOString(),
    size: `${(Math.random() * 5 + 0.1).toFixed(1)} MB`
  };
  
  return updatedReport;
}

/**
 * Simulates downloading the report file.
 */
export async function downloadReport(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`Report ${id} downloaded.`);
  return true;
}
