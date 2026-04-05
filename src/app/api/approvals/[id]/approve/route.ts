import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, errorResponse } from "@/lib/api-response";
import { executeApproval } from "@/helpers/approval-helper";
import type { DisbursementAccounts } from "@/helpers/accounting-functions";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/approvals/[id]/approve — Director / MD only
export const POST = withAuth(async (req: AuthedRequest, ctx: any) => {
  const params = await ctx.params;
  const approvalId = parseInt(params.id);
  const approval = await prisma.pendingApproval.findUnique({ where: { approvalId } });
  if (!approval) return notFound("approval");
  if (approval.status !== "pending") {
    return errorResponse("APPROVAL_ALREADY_ACTIONED", "This approval has already been actioned.", undefined, 409);
  }

  let body: { note?: string; disbursementAccounts?: DisbursementAccounts } = {};
  try { body = await req.json(); } catch { /**/ }

  const result = await executeApproval(
    prisma,
    approvalId,
    req.user.sub,
    body.disbursementAccounts
  );

  // Update approval record with note
  if (body.note) {
    await prisma.pendingApproval.update({
      where: { approvalId },
      data:  { reviewNotes: body.note },
    });
  }

  // Update approvedBy on the loan if this is a loan creation
  if (result.entityType === "loan") {
    await prisma.loanPortfolio.update({
      where: { loanId: result.entityId },
      data:  { approvedBy: parseInt(req.user.sub), approvedAt: new Date() },
    });
  }

  const updatedApproval = await prisma.pendingApproval.findUnique({ where: { approvalId } });

  await prisma.activityLog.create({
    data: {
      userId:     parseInt(req.user.sub),
      username:   req.user.sub,
      actionType: "APPROVE",
      entityType: approval.entityType,
      entityId:   approval.entityId ?? undefined,
      description: `Approved ${approval.actionType} for ${approval.entityType}`,
    },
  });

  return successResponse({
    request:         updatedApproval,
    executionResult: result.data,
  });
}, ["Director", "MD", "Developer", "Admin", "Accountant"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
