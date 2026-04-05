import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, errorResponse, forbidden } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/approvals/[id]/cancel
export const POST = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const approvalId = parseInt(ctx.params.id);
  const approval = await prisma.pendingApproval.findUnique({ where: { approvalId } });
  if (!approval) return notFound("approval");
  if (approval.status !== "pending") return errorResponse("APPROVAL_ALREADY_ACTIONED", "Already actioned.", undefined, 409);

  // Only the original submitter or Director/MD can cancel
  const canCancel = approval.submittedBy === req.user.sub || ["Director", "MD", "Developer"].includes(req.user.role);
  if (!canCancel) return forbidden();

  let body: { note?: string } = {};
  try { body = await req.json(); } catch { /**/ }

  const updated = await prisma.pendingApproval.update({
    where: { approvalId },
    data:  { status: "cancelled", reviewedBy: req.user.sub, reviewedAt: new Date(), reviewNotes: body.note },
  });

  return successResponse({ request: updated });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
