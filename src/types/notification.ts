export type NotificationType = "info" | "success" | "warning" | "critical";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  link?: string; // Route to navigate to
}
