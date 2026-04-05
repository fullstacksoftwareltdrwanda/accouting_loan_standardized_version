import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";

// Stub: In production, send an OTP or reset link via email provider (SendGrid, etc.)
export async function POST(req: NextRequest) {
  let body: { email?: string };
  try { body = await req.json(); } catch { return errorResponse("VALIDATION_FAILED", "Invalid JSON", undefined, 400); }
  if (!body.email) return errorResponse("VALIDATION_FAILED", "email is required.", undefined, 400);

  // Always return success to prevent email enumeration
  return successResponse({
    message: "If that email address is registered, you will receive a reset link shortly.",
  });
}
