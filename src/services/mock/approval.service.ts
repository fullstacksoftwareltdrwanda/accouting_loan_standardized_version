import { ApprovalRequest } from "@/types/approval";
import { MOCK_APPROVALS } from "@/data/mock/approvals";

/**
 * APPROVAL SERVICE: Production-ready backend skeleton.
 */

export async function getPendingRequests(): Promise<ApprovalRequest[]> {
  // TODO: Replace with backend API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_APPROVALS];
}

export async function processRequest(id: string, action: "approve" | "reject"): Promise<boolean> {
  // TODO: PATCH to backend API
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Auditing ${action} for request ${id}...`);
  return true;
}
