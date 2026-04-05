/**
 * api-client.ts
 *
 * Shared HTTP client for all frontend service calls.
 * - Reads access token from localStorage
 * - Appends Authorization: Bearer <token> header
 * - Wraps responses in a typed APIResult<T>
 * - On 401 → attempts token refresh once; on failure → clears session + redirects to /login
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

export interface APIResult<T> {
  success: boolean;
  data?: T;
  meta?: {
    page: number;
    perPage: number;
    total: number;
    hasMore: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: { field: string; issue: string }[];
  };
}

// Token storage keys
const ACCESS_TOKEN_KEY  = "alms_access_token";
const REFRESH_TOKEN_KEY = "alms_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/** Main fetch wrapper */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<APIResult<T>> {
  const { skipAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> ?? {}),
  };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });

  // Handle 204 No Content
  if (response.status === 204) return { success: true };

  const json = await response.json() as APIResult<T>;

  // Auto-refresh on 401
  if (response.status === 401 && !skipAuth) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      // Retry original request once
      return apiFetch<T>(path, options);
    } else {
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
      return json;
    }
  }

  return json;
}

async function attemptRefresh(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    if (json.data?.accessToken) {
      setTokens(json.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/** Convenience wrappers */
export const api = {
  get:    <T>(path: string, opts?: RequestInit)                     => apiFetch<T>(path, { method: "GET",    ...opts }),
  post:   <T>(path: string, body: unknown, opts?: RequestInit)      => apiFetch<T>(path, { method: "POST",   body: JSON.stringify(body), ...opts }),
  put:    <T>(path: string, body: unknown, opts?: RequestInit)      => apiFetch<T>(path, { method: "PUT",    body: JSON.stringify(body), ...opts }),
  patch:  <T>(path: string, body?: unknown, opts?: RequestInit)     => apiFetch<T>(path, { method: "PATCH",  body: body ? JSON.stringify(body) : undefined, ...opts }),
  delete: <T>(path: string, body?: unknown, opts?: RequestInit)     => apiFetch<T>(path, { method: "DELETE", body: body ? JSON.stringify(body) : undefined, ...opts }),
};
