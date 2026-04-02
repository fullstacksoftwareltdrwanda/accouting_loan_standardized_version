import { DashboardStats } from "@/types/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mock/dashboard";

/**
 * DASHBOARD SERVICE: Production-ready backend skeleton.
 */

export async function getDashboardStats(): Promise<DashboardStats> {
  // TODO: Replace with backend API call (NestJS/Prisma aggregation)
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ...MOCK_DASHBOARD_DATA };
}
