import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { verifyAccessToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  let body: { refreshToken?: string };
  try { body = await req.json(); } catch { return errorResponse("VALIDATION_FAILED", "Invalid JSON", undefined, 400); }

  if (!body.refreshToken) {
    return errorResponse("VALIDATION_FAILED", "refreshToken is required.", undefined, 400);
  }

  // Revoke the refresh token
  await prisma.user.updateMany({
    where: { refreshToken: body.refreshToken },
    data:  { refreshToken: null },
  });

  // Log logout if we can identify the user from the access token
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const payload = verifyAccessToken(authHeader.split(" ")[1]);
      const userId = parseInt(payload.sub);
      const user = await prisma.user.findUnique({ where: { userId } });
      if (user) {
        await prisma.activityLog.create({
          data: {
            userId,
            username:   user.username,
            actionType: "LOGOUT",
            ipAddress:  req.headers.get("x-forwarded-for") ?? undefined,
            description: "User logged out",
          },
        });
      }
    } catch { /* access token may be expired — still log out */ }
  }

  return successResponse({ success: true });
}
