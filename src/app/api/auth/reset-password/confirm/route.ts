import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { validatePasswordComplexity } from "@/lib/password";

// Stub: verify token from email and apply new password
export async function POST(req: NextRequest) {
  let body: { token?: string; newPassword?: string };
  try { body = await req.json(); } catch { return errorResponse("VALIDATION_FAILED", "Invalid JSON", undefined, 400); }

  if (!body.token)       return errorResponse("VALIDATION_FAILED", "token is required.", undefined, 400);
  if (!body.newPassword) return errorResponse("VALIDATION_FAILED", "newPassword is required.", undefined, 400);
  if (!validatePasswordComplexity(body.newPassword))
    return errorResponse("VALIDATION_FAILED", "Password must be min 8 chars, 1 uppercase, 1 digit.", undefined, 400);

  // TODO: Validate the OTP/token against a reset_tokens table, hash and apply password
  return successResponse({ success: true });
}
