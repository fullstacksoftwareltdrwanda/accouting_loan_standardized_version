import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, buildPaginationMeta } from "@/lib/api-response";

// GET /api/notifications
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";
  const page       = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage    = 20;
  const userId     = parseInt(req.user.sub);

  const where: Record<string, unknown> = { userId };
  if (unreadOnly) where.read = false;

  const [total, notifications, unreadCount] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.findMany({
      where,
      skip:    (page - 1) * perPage,
      take:    perPage,
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);

  return successResponse(
    {
      notifications: notifications.map((n) => ({
        id:         String(n.id),
        type:       n.type,
        title:      n.title,
        message:    n.message,
        entityType: n.entityType,
        entityId:   n.entityId,
        read:       n.read,
        createdAt:  n.createdAt.toISOString(),
      })),
      unreadCount,
    },
    buildPaginationMeta(total, page, perPage)
  );
}) as unknown as (req: NextRequest) => Promise<Response>;
