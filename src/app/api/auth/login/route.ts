import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import { signAccessToken, signRefreshToken, buildPermissions, getTokenExpiry } from "@/lib/jwt";
import { successResponse, errorResponse, validationError } from "@/lib/api-response";

// Simple in-memory rate limiter (per IP, 5 attempts / 15 min)
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS    = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return errorResponse(
      "RATE_LIMITED",
      "Too many failed login attempts. Please wait 15 minutes.",
      undefined,
      429
    );
  }

  let body: { identifier?: string; password?: string };
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const { identifier, password } = body;
  const errs: { field: string; issue: string }[] = [];
  if (!identifier) errs.push({ field: "identifier", issue: "Required" });
  if (!password)   errs.push({ field: "password",   issue: "Required" });
  if (errs.length) return validationError(errs);

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
      isActive: true,
    },
  });

  if (!user || !(await comparePassword(password!, user.password))) {
    return errorResponse("INVALID_CREDENTIALS", "Invalid identifier or password.", undefined, 401);
  }

  const permissions = buildPermissions(user.role);
  const accessToken  = signAccessToken({ sub: String(user.userId), role: user.role, permissions });
  const refreshToken = signRefreshToken(String(user.userId));
  const expiresAt    = getTokenExpiry();

  // Persist refresh token
  await prisma.user.update({
    where: { userId: user.userId },
    data:  { refreshToken, lastLogin: new Date() } as any,
  });

  // Log login activity
  await prisma.activityLog.create({
    data: {
      userId:     user.userId,
      username:   user.username,
      actionType: "LOGIN",
      ipAddress:  ip,
      userAgent:  req.headers.get("user-agent") ?? undefined,
      description: "User logged in",
    },
  });

  return successResponse({
    accessToken,
    refreshToken,
    expiresAt,
    user: {
      id:          String(user.userId),
      username:    user.username,
      email:       user.email,
      role:        user.role,
      fullName:    user.fullName,
      permissions,
    },
  });
}
