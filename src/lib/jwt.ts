import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

export interface JWTPayload {
  sub: string;      // user ID
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export function signAccessToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, type: "refresh" }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_SECRET) as { sub: string };
}

/** Returns access token expiry as an ISO8601 string */
export function getTokenExpiry(): string {
  const hours = parseInt(JWT_EXPIRES_IN.replace("h", ""), 10) || 8;
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

/** Build permission array from role */
export function buildPermissions(role: string): string[] {
  const map: Record<string, string[]> = {
    Director:   ["customers:read", "customers:write", "loans:read", "loans:write", "loans:approve", "payments:read", "payments:write", "ledger:read", "ledger:write", "approvals:execute", "admin:full", "reports:read"],
    MD:         ["customers:read", "customers:write", "loans:read", "loans:write", "loans:approve", "payments:read", "payments:write", "ledger:read", "ledger:write", "approvals:execute", "admin:full", "reports:read"],
    Accountant: ["customers:read", "customers:write", "loans:read", "loans:write", "payments:write", "ledger:read", "ledger:write", "approvals:submit", "reports:read"],
    Secretary:  ["customers:read", "customers:write", "loans:read", "payments:read", "approvals:submit"],
    Admin:      ["customers:read", "loans:read", "payments:read", "ledger:read", "admin:full", "reports:read"],
    Developer:  ["customers:read", "customers:write", "loans:read", "loans:write", "loans:approve", "payments:read", "payments:write", "ledger:read", "ledger:write", "approvals:execute", "admin:full", "reports:read"],
  };
  return map[role] ?? [];
}
