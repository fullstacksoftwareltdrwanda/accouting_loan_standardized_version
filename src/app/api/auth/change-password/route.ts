import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/jwt";
import { comparePassword, hashPassword, validatePasswordComplexity } from "@/lib/password";
import { successResponse, errorResponse, validationError, unauthorized } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return unauthorized();

  let payload;
  try { payload = verifyAccessToken(authHeader.split(" ")[1]); }
  catch { return unauthorized(); }

  let body: { currentPassword?: string; newPassword?: string };
  try { body = await req.json(); } catch { return errorResponse("VALIDATION_FAILED", "Invalid JSON", undefined, 400); }

  const errs: { field: string; issue: string }[] = [];
  if (!body.currentPassword) errs.push({ field: "currentPassword", issue: "Required" });
  if (!body.newPassword)     errs.push({ field: "newPassword",     issue: "Required" });
  if (body.newPassword && !validatePasswordComplexity(body.newPassword))
    errs.push({ field: "newPassword", issue: "Min 8 chars, 1 uppercase, 1 digit" });
  if (errs.length) return validationError(errs);

  const user = await prisma.user.findUnique({ where: { userId: parseInt(payload.sub) } });
  if (!user) return unauthorized();

  const valid = await comparePassword(body.currentPassword!, user.password);
  if (!valid) return errorResponse("INVALID_CREDENTIALS", "Current password is incorrect.", undefined, 401);

  const hashed = await hashPassword(body.newPassword!);
  await prisma.user.update({ where: { userId: user.userId }, data: { password: hashed } });

  return successResponse({ success: true });
}
