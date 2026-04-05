import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse } from "@/lib/api-response";

// GET /api/approvals/pending-count
export const GET = withAuth(async (_req: AuthedRequest) => {
  const count = await prisma.pendingApproval.count({ where: { status: "pending" } });
  return successResponse({ count });
}) as unknown as (req: NextRequest) => Promise<Response>;
