import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, buildPaginationMeta } from "@/lib/api-response";

// GET /api/audit-log
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const userId     = searchParams.get("userId")     ? parseInt(searchParams.get("userId")!)     : undefined;
  const entityType = searchParams.get("entityType") ?? undefined;
  const actionType = searchParams.get("actionType") ?? undefined;
  const from       = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
  const to         = searchParams.get("to")   ? new Date(searchParams.get("to")!)   : undefined;
  const page       = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage    = 50;

  const where: Record<string, unknown> = {};
  if (userId)     where.userId     = userId;
  if (entityType) where.entityType = entityType;
  if (actionType) where.actionType = actionType;
  if (from || to) where.createdAt  = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };

  const [total, logs] = await Promise.all([
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({
      where,
      skip:    (page - 1) * perPage,
      take:    perPage,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return successResponse(
    {
      logs: logs.map((l) => ({
        id:          String(l.id),
        userId:      String(l.userId),
        username:    l.username,
        actionType:  l.actionType,
        entityType:  l.entityType,
        entityId:    l.entityId,
        description: l.description,
        ipAddress:   l.ipAddress,
        userAgent:   l.userAgent,
        createdAt:   l.createdAt.toISOString(),
      })),
    },
    buildPaginationMeta(total, page, perPage)
  );
}, ["Director", "MD", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;
