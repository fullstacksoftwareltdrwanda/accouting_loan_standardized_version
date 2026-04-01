import { ApprovalRequest } from "@/types/approval";
import { MOCK_APPROVALS } from "@/data/mock/approvals";

/**
 * Service to manage Approval Requests.
 * Simulated async backend calls.
 */
export async function getPendingRequests(): Promise<ApprovalRequest[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_APPROVALS].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function processRequest(id: string, action: "approve" | "reject"): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Request ${id} has been ${action}ed.`);
  return true;
}
