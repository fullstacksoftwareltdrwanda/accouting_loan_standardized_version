import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, errorResponse, validationError } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/approvals/[id]/reject
export const POST = withAuth(async (req: AuthedRequest, ctx: any) => {
  const params = await ctx.params;
  const approvalId = parseInt(params.id);
  const approval = await prisma.pendingApproval.findUnique({ where: { approvalId } });
  if (!approval) return notFound("approval");
  if (approval.status !== "pending") return errorResponse("APPROVAL_ALREADY_ACTIONED", "Already actioned.", undefined, 409);

  let body: { note?: string };
  try { body = await req.json(); } catch { body = {}; }
  if (!body.note) return validationError([{ field: "note", issue: "Rejection note is mandatory" }]);

  const updated = await prisma.pendingApproval.update({
    where: { approvalId },
    data:  { status: "rejected", reviewedBy: req.user.sub, reviewedAt: new Date(), reviewNotes: body.note },
  });

  await prisma.activityLog.create({
    data: {
      userId:     parseInt(req.user.sub),
      username:   req.user.sub,
      actionType: "REJECT",
      entityType: approval.entityType,
      entityId:   approval.entityId ?? undefined,
      description: `Rejected ${approval.actionType}: ${body.note}`,
    },
  });

  return successResponse({ request: updated });
}, ["Director", "MD", "Developer", "Admin", "Accountant"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
