"use server";

// Temporarily self-contained for debugging bundling issues
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
  };
};

export async function loginAction(data: { identifier: string; password: string }): Promise<LoginResult> {
  console.log("Login action called for identifier:", data.identifier);

  // --- Local Demo Fallback ---
  const demoUser = {
    username: "admin",
    password: "password123",
    role: "Admin" as UserRole,
  };

  if (data.identifier === demoUser.username && data.password === demoUser.password) {
    return {
      success: true,
      user: {
        id: "demo-001",
        username: demoUser.username,
        email: "demo@alms.com",
        role: demoUser.role,
        fullName: "System Admin (Demo Mode)",
      },
    };
  }

  // --- Search for User in Real DB (Temporarily Disabled for debugging) ---
  /*
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.identifier },
          { username: data.identifier },
        ],
      },
    });
    ...
  } catch (error) {
    ...
  }
  */

  return { 
    success: false, 
    message: "Invalid credentials or system not yet connected to the directory." 
  };
}
