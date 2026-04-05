import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, createdResponse, validationError, buildPaginationMeta } from "@/lib/api-response";
import { hashPassword } from "@/lib/password";

// GET /api/users
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const role    = searchParams.get("role")   ?? undefined;
  const search  = searchParams.get("search") ?? undefined;
  const page    = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = 20;

  const where: Record<string, unknown> = {};
  if (role)   where.role = role;
  if (search) where.OR = [
    { username: { contains: search, mode: "insensitive" } },
    { fullName: { contains: search, mode: "insensitive" } },
    { email:    { contains: search, mode: "insensitive" } },
  ];

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip:    (page - 1) * perPage,
      take:    perPage,
      orderBy: { createdAt: "desc" },
      select:  { userId: true, username: true, fullName: true, email: true, phone: true, role: true, isActive: true, status: true, lastLogin: true, createdAt: true },
    }),
  ]);

  return successResponse(
    { users: users.map((u) => ({ ...u, id: String(u.userId), lastLogin: u.lastLogin?.toISOString() ?? null })) },
    buildPaginationMeta(total, page, perPage)
  );
}, ["Director", "MD", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;

// POST /api/users
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];
  if (!body.username) errs.push({ field: "username", issue: "Required" });
  if (!body.email)    errs.push({ field: "email",    issue: "Required" });
  if (!body.password) errs.push({ field: "password", issue: "Required" });
  if (!body.role)     errs.push({ field: "role",     issue: "Required" });
  if (!body.fullName) errs.push({ field: "fullName", issue: "Required" });
  if (errs.length) return validationError(errs);

  const hashed = await hashPassword(String(body.password));

  const user = await prisma.user.create({
    data: {
      username: String(body.username),
      fullName: String(body.fullName),
      email:    String(body.email),
      password: hashed,
      role:     body.role as "Director" | "MD" | "Accountant" | "Secretary" | "Developer" | "Admin",
      phone:    body.phone ? String(body.phone) : undefined,
      isActive: true,
      status:   "active",
    },
    select: { userId: true, username: true, fullName: true, email: true, role: true, isActive: true, createdAt: true },
  });

  return createdResponse({ user: { ...user, id: String(user.userId) } });
}, ["Director", "MD", "Developer"]) as unknown as (req: NextRequest) => Promise<Response>;
