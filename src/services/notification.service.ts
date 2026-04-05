/**
 * Notification Service — real API implementation.
 * Replaces src/services/mock/notification.service.ts
 */
import { api } from "@/lib/api-client";
import { Notification } from "@/types/notification";

function mapToNotification(n: any): Notification {
  return {
    id: String(n.id),
    type: (n.type?.toLowerCase() || "info") as any,
    title: n.title,
    description: n.message,
    date: n.createdAt,
    isRead: n.isRead,
    link: n.metadata?.link
  };
}

export async function getNotifications(unreadOnly = false): Promise<{ notifications: Notification[]; unreadCount: number }> {
  const result = await api.get<{ notifications: any[]; unreadCount: number }>(
    `/api/notifications${unreadOnly ? "?unread=true" : ""}`
  );
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch notifications");
  
  return {
    notifications: result.data!.notifications.map(mapToNotification),
    unreadCount: result.data!.unreadCount
  };
}

export async function markAsRead(id: string): Promise<void> {
  await api.patch(`/api/notifications/${id}/read`);
}

export async function markAllRead(): Promise<void> {
  await api.patch("/api/notifications/read-all");
}
