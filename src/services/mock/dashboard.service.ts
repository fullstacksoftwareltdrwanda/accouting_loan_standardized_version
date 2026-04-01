import { DashboardStats } from "@/types/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mock/dashboard";

/**
 * Service to fetch dashboard-related metrics.
 * Using async to simulate future API/Backend integration.
 */
export async function getDashboardData(): Promise<DashboardStats> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return MOCK_DASHBOARD_DATA;
}
