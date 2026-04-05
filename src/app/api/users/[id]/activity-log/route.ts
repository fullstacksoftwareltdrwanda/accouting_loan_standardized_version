import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, buildPaginationMeta } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/users/[id]/activity-log
export const GET = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const userId = parseInt(ctx.params.id);
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) return notFound("user");

  const page    = Math.max(1, parseInt(new URL(req.url).searchParams.get("page") ?? "1"));
  const perPage = 25;

  const [total, logs] = await Promise.all([
    prisma.activityLog.count({ where: { userId } }),
    prisma.activityLog.findMany({
      where:   { userId },
      skip:    (page - 1) * perPage,
      take:    perPage,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return successResponse(
    {
      logs: logs.map((l) => ({
        id:          String(l.id),
        actionType:  l.actionType,
        entityType:  l.entityType,
        entityId:    l.entityId,
        description: l.description,
        ipAddress:   l.ipAddress,
        createdAt:   l.createdAt.toISOString(),
      })),
    },
    buildPaginationMeta(total, page, perPage)
  );
}, ["Director", "MD", "Developer", "Admin"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
