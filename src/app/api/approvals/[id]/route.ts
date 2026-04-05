import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, errorResponse, validationError } from "@/lib/api-response";
import { executeApproval } from "@/helpers/approval-helper";
import type { DisbursementAccounts } from "@/helpers/accounting-functions";

type Ctx = { params: Promise<{ id: string }> };

function formatApproval(a: Record<string, unknown>) {
  return {
    id:           String(a.approvalId),
    requestType:  a.actionType,
    entityType:   a.entityType,
    entityId:     a.entityId ? String(a.entityId) : null,
    payload:      (() => { try { return JSON.parse(String(a.actionData)); } catch { return {}; } })(),
    previousState: (() => { try { return a.previousState ? JSON.parse(String(a.previousState)) : null; } catch { return null; } })(),
    requestedBy:  a.submittedBy,
    requestedAt:  a.submittedAt instanceof Date ? a.submittedAt.toISOString() : a.submittedAt,
    status:       a.status,
    actionedBy:   a.reviewedBy ?? null,
    actionedAt:   a.reviewedAt instanceof Date ? a.reviewedAt.toISOString() : (a.reviewedAt ?? null),
    actionNote:   a.reviewNotes ?? null,
    description:  a.description,
  };
}

// GET /api/approvals/[id]
export const GET = withAuth(async (_req: AuthedRequest, ctx: any) => {
  const params = await ctx.params;
  const approvalId = parseInt(params.id);
  const approval = await prisma.pendingApproval.findUnique({ where: { approvalId } });
  if (!approval) return notFound("approval");

  const formatted = formatApproval(approval as unknown as Record<string, unknown>);

  // Build field-level diff between previousState and payload
  const prev    = formatted.previousState ?? {};
  const current = formatted.payload ?? {};
  const allKeys = [...new Set([...Object.keys(prev), ...Object.keys(current)])];
  const diff    = allKeys
    .filter((k) => JSON.stringify(prev[k]) !== JSON.stringify(current[k]))
    .map((k) => ({ field: k, before: prev[k], after: current[k] }));

  return successResponse({ request: formatted, diff });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;

// POST /api/approvals/[id]/approve — handled in sub-route, re-exported here for convenience
// POST /api/approvals/[id]/reject
// POST /api/approvals/[id]/cancel
// These are in their own route files below
