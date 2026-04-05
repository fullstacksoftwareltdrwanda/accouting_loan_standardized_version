import { NextRequest } from "next/server";
import { verifyAccessToken, JWTPayload } from "@/lib/jwt";
import { unauthorized, forbidden, tokenExpired } from "@/lib/api-response";

export type AuthedRequest = NextRequest & { user: JWTPayload };

type RouteHandler = (req: AuthedRequest, ctx: { params: Record<string, string> }) => Promise<Response>;

/**
 * Wraps a Route Handler with JWT auth + optional role guard.
 *
 * @param handler   The actual route logic
 * @param roles     Allowed roles. Empty = any authenticated user.
 */
export function withAuth(handler: RouteHandler, roles: string[] = []): RouteHandler {
  return async (req, ctx) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return unauthorized() as unknown as Response;
    }

    const token = authHeader.split(" ")[1];
    let payload: JWTPayload;

    try {
      payload = verifyAccessToken(token);
    } catch (err: unknown) {
      const isExpired = err instanceof Error && err.message?.includes("expired");
      return (isExpired ? tokenExpired() : unauthorized()) as unknown as Response;
    }

    if (roles.length > 0 && !roles.includes(payload.role)) {
      return forbidden() as unknown as Response;
    }

    // Attach user to request
    (req as AuthedRequest).user = payload;
    return handler(req as AuthedRequest, ctx);
  };
}
