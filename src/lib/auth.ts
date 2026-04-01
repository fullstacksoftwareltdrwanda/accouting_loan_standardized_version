/**
 * Authentication management for the ALMS system.
 * This is a mock implementation for the initial frontend task.
 */

export type UserRole = "Director" | "MD" | "Accountant" | "Secretary" | "Developer" | "Admin";

export interface AuthSession {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
  expires: string;
}

export const simulateLogin = async (data: { identifier: string; password: string }): Promise<AuthSession> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // For simulation purposes, reject if password is "error"
  if (data.password === "error") {
    throw new Error("Invalid credentials. Please check your username and password.");
  }

  // Success simulation
  return {
    user: {
      id: "usr_123456",
      username: data.identifier,
      email: data.identifier.includes("@") ? data.identifier : `${data.identifier}@example.alms.com`,
      role: "Admin",
    },
    expires: new Date(Date.now() + 86400000).toISOString(),
  };
};

export const logout = () => {
  console.log("Mock logout executed.");
};
