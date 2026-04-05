import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound, validationError } from "@/lib/api-response";
import { hashPassword } from "@/lib/password";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/users/[id]
export const GET = withAuth(async (_req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const userId = parseInt(ctx.params.id);
  const user = await prisma.user.findUnique({
    where:  { userId },
    select: { userId: true, username: true, fullName: true, email: true, phone: true, role: true, isActive: true, status: true, lastLogin: true, createdAt: true },
  });
  if (!user) return notFound("user");
  return successResponse({ user: { ...user, id: String(user.userId) } });
}, ["Director", "MD", "Developer", "Admin"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;

// PUT /api/users/[id]
export const PUT = withAuth(async (req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const userId = parseInt(ctx.params.id);
  const existing = await prisma.user.findUnique({ where: { userId } });
  if (!existing) return notFound("user");

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const updateData: Record<string, unknown> = {};
  if (body.fullName !== undefined) updateData.fullName  = String(body.fullName);
  if (body.email    !== undefined) updateData.email     = String(body.email);
  if (body.phone    !== undefined) updateData.phone     = String(body.phone);
  if (body.role     !== undefined) updateData.role      = body.role;
  if (body.isActive !== undefined) updateData.isActive  = Boolean(body.isActive);
  if (body.status   !== undefined) updateData.status    = String(body.status);
  if (body.password !== undefined) updateData.password  = await hashPassword(String(body.password));

  const updated = await prisma.user.update({ where: { userId }, data: updateData });
  return successResponse({ user: { id: String(updated.userId), username: updated.username, fullName: updated.fullName, email: updated.email, role: updated.role } });
}, ["Director", "MD", "Developer"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;

// DELETE /api/users/[id]
export const DELETE = withAuth(async (_req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const userId = parseInt(ctx.params.id);
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) return notFound("user");

  // Soft delete
  await prisma.user.update({ where: { userId }, data: { isActive: false, status: "inactive" } });
  return successResponse({ success: true });
}, ["Director", "MD", "Developer"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
