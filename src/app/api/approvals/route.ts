import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, createdResponse, notFound, errorResponse, validationError, buildPaginationMeta } from "@/lib/api-response";
import { executeApproval } from "@/helpers/approval-helper";
import type { DisbursementAccounts } from "@/helpers/accounting-functions";

// GET /api/approvals
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const status      = searchParams.get("status") ?? "pending";
  const requestType = searchParams.get("requestType") ?? undefined;
  const requestedBy = searchParams.get("requestedBy") ?? undefined;
  const page        = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage     = 25;

  const where: Record<string, unknown> = {};

  // Non-Director/MD/Admin only see their own submissions
  if (!["Director", "MD", "Developer", "Admin", "Accountant"].includes(req.user.role)) {
    where.submittedBy = req.user.sub;
  }

  if (status)      where.status      = status;
  if (requestType) where.actionType  = requestType;
  if (requestedBy) where.submittedBy = requestedBy;

  const [total, requests] = await Promise.all([
    prisma.pendingApproval.count({ where }),
    prisma.pendingApproval.findMany({
      where,
      skip:    (page - 1) * perPage,
      take:    perPage,
      orderBy: { submittedAt: "desc" },
    }),
  ]);

  return successResponse(
    { requests: requests.map(formatApproval) },
    buildPaginationMeta(total, page, perPage)
  );
}) as unknown as (req: NextRequest) => Promise<Response>;

// POST /api/approvals — create a new request for approval
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const { actionType, entityType, entityId, actionData, description } = body as {
    actionType: string;
    entityType: string;
    entityId?: number;
    actionData: any;
    description: string;
  };

  if (!actionType || !entityType || !actionData || !description) {
    return validationError([{ field: "form", issue: "Missing required approval fields" }]);
  }

  // Check if there's already a pending approval for this entity/action to avoid duplicates
  if (entityId) {
    const existing = await prisma.pendingApproval.findFirst({
        where: {
            entityType,
            entityId,
            actionType,
            status: "pending"
        }
    });
    if (existing) return errorResponse("PENDING_EXISTS", "A pending request for this item already exists.");
  }

  const approval = await prisma.pendingApproval.create({
    data: {
      actionType,
      entityType,
      entityId: entityId ? Number(entityId) : null,
      actionData: JSON.stringify(actionData),
      description,
      submittedBy: req.user.sub,
      submittedByRole: req.user.role,
      status: "pending",
    }
  });

  return createdResponse({ request: formatApproval(approval as unknown as Record<string, unknown>) });
}) as unknown as (req: NextRequest) => Promise<Response>;

// GET /api/approvals/pending-count — badge count for nav
export async function pendingCount(req: NextRequest) {
  return withAuth(async (_req: AuthedRequest) => {
    const count = await prisma.pendingApproval.count({ where: { status: "pending" } });
    return successResponse({ count });
  })(req as AuthedRequest, { params: {} });
}

function formatApproval(a: Record<string, unknown>) {
  return {
    id:              String(a.approvalId),
    requestType:     a.actionType,
    entityType:      a.entityType,
    entityId:        a.entityId ? String(a.entityId) : null,
    payload:         JSON.parse(String(a.actionData)),
    previousState:   a.previousState ? JSON.parse(String(a.previousState)) : null,
    requestedBy:     a.submittedBy,
    requestedAt:     a.submittedAt instanceof Date ? a.submittedAt.toISOString() : a.submittedAt,
    status:          a.status,
    actionedBy:      a.reviewedBy ?? null,
    actionedAt:      a.reviewedAt instanceof Date ? a.reviewedAt.toISOString() : (a.reviewedAt ?? null),
    actionNote:      a.reviewNotes ?? null,
    description:     a.description,
  };
}
