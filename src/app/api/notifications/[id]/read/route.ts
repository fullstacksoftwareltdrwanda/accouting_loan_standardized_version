import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/notifications/[id]/read
export const PATCH = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const id = parseInt(ctx.params.id);
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) return notFound("notification");
  if (notification.userId !== parseInt(req.user.sub)) return notFound("notification");

  await prisma.notification.update({ where: { id }, data: { read: true } });

  return successResponse({ success: true });
}) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
