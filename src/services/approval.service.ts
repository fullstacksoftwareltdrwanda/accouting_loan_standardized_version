/**
 * Approval Service — real API implementation.
 * Replaces src/services/mock/approval.service.ts
 */
import { api } from "@/lib/api-client";
import type { DisbursementAccounts } from "@/helpers/accounting-functions";
import { ApprovalRequest } from "@/types/approval";

function mapToApprovalRequest(a: any): ApprovalRequest {
  return {
    id: String(a.id),
    type: a.entityType as any,
    action: a.requestType || a.actionType,
    title: `${a.requestType || a.actionType} for ${a.entityType} #${a.entityId}`,
    requester: a.requestedBy || a.requester?.fullName || "System",
    amount: a.payload?.amount || a.payload?.loanAmount ? Number(a.payload?.amount || a.payload?.loanAmount) : undefined,
    date: (a.requestedAt || a.createdAt || "").split("T")[0],
    status: (a.status || "").toLowerCase() as any,
    description: a.description || a.payload?.description || "",
    reviewedBy: a.actionedBy || undefined,
    metadata: a.payload || {},
  };
}

export async function getPendingRequests(filters?: Record<string, unknown>): Promise<ApprovalRequest[]> {
  const qs = filters ? "?" + new URLSearchParams(filters as Record<string, string>).toString() : "";
  const result = await api.get<{ requests: any[] }>(`/api/approvals${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch approvals");
  return result.data!.requests.map(mapToApprovalRequest);
}

export async function getPendingCount(): Promise<number> {
  const result = await api.get<{ count: number }>("/api/approvals/pending-count");
  return result.data?.count ?? 0;
}

export async function getApprovalById(id: string) {
  const result = await api.get<{ request: unknown; diff: unknown[] }>(`/api/approvals/${id}`);
  if (!result.success) throw new Error(result.error?.message ?? "Approval not found");
  return result.data!;
}

export async function approveRequest(
  id: string,
  note?: string,
  disbursementAccounts?: DisbursementAccounts
) {
  const result = await api.post<{ request: unknown; executionResult: unknown }>(
    `/api/approvals/${id}/approve`,
    { note, disbursementAccounts }
  );
  if (!result.success) throw new Error(result.error?.message ?? "Approval failed");
  return result.data!;
}

export async function rejectRequest(id: string, note: string) {
  const result = await api.post<{ request: unknown }>(`/api/approvals/${id}/reject`, { note });
  if (!result.success) throw new Error(result.error?.message ?? "Rejection failed");
  return result.data!.request;
}

export async function cancelRequest(id: string, note?: string) {
  const result = await api.post<{ request: unknown }>(`/api/approvals/${id}/cancel`, { note });
  if (!result.success) throw new Error(result.error?.message ?? "Cancellation failed");
  return result.data!.request;
}

export async function createApproval(data: {
  actionType: string;
  entityType: string;
  entityId?: number;
  actionData: any;
  description: string;
}) {
  const result = await api.post<{ request: any }>("/api/approvals", data);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to create approval request");
  return result.data!.request;
}
