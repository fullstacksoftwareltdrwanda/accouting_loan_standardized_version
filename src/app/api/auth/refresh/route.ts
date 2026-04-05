import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRefreshToken, signAccessToken, buildPermissions, getTokenExpiry } from "@/lib/jwt";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  let body: { refreshToken?: string };
  try { body = await req.json(); } catch { return errorResponse("VALIDATION_FAILED", "Invalid JSON", undefined, 400); }

  if (!body.refreshToken) {
    return errorResponse("VALIDATION_FAILED", "refreshToken is required.", undefined, 400);
  }

  let decoded: { sub: string };
  try {
    decoded = verifyRefreshToken(body.refreshToken);
  } catch {
    return errorResponse("TOKEN_EXPIRED", "Refresh token is invalid or expired.", undefined, 401);
  }

  const user = await (prisma.user as any).findFirst({
    where: { userId: parseInt(decoded.sub), refreshToken: body.refreshToken, isActive: true },
  });

  if (!user) {
    return errorResponse("TOKEN_EXPIRED", "Refresh token has been revoked.", undefined, 401);
  }

  const permissions = buildPermissions(user.role);
  const accessToken = signAccessToken({ sub: String(user.userId), role: user.role, permissions });
  const expiresAt   = getTokenExpiry();

  return successResponse({ accessToken, expiresAt });
}
