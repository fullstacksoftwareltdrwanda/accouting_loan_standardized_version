"use server";

import { cookies } from "next/headers";

export type UserRole = "Director" | "MD" | "Accountant" | "Secretary" | "Developer" | "Admin";

export type LoginResult = {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    fullName: string;
    permissions: string[];
    accessToken: string;
    refreshToken: string;
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Login Server Action */
export async function loginAction(data: { identifier: string; password: string }): Promise<LoginResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ identifier: data.identifier, password: data.password }),
      cache:   "no-store",
    });

    // Check if response is JSON (safeguard against 500 HTML errors)
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("DEBUG: Server non-JSON response:", text);
      return { success: false, message: "Server error. Please try again later." };
    }

    const json = await res.json();

    if (!res.ok || !json.success) {
      return { success: false, message: json.error?.message ?? "Login failed." };
    }

    // Set HTTP-only cookie for middleware session protection
    const cookieStore = await cookies();
    cookieStore.set("alms_session", json.data.accessToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 8, // 8 hours (matches JWT_EXPIRES_IN)
      path:     "/",
    });

    return {
      success: true,
      user: {
        id:          json.data.user.id,
        username:    json.data.user.username,
        email:       json.data.user.email,
        role:        json.data.user.role,
        fullName:    json.data.user.fullName,
        permissions: json.data.user.permissions,
        accessToken: json.data.accessToken,
        refreshToken: json.data.refreshToken,
      },
    };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Unable to connect to the authentication server." };
  }
}

/** Logout Server Action */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("alms_session");
  // The client side must also call clearTokens() from api-client.ts
}

