export type UserRole = "Director" | "Manager" | "Staff" | "Auditor";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  joinedDate: string;
  lastLogin: string;
  status: "active" | "away" | "offline";
  twoFactorEnabled: boolean;
  permissions: string[];
}
