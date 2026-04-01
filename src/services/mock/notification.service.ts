import { Notification } from "@/types/notification";
import { MOCK_NOTIFICATIONS } from "@/data/mock/notifications";

/**
 * Service to manage Operational Notifications.
 * Simulated async backend calls.
 */
export async function getNotifications(): Promise<Notification[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...MOCK_NOTIFICATIONS].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Notification ${id} marked as read.`);
  return true;
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`All notifications marked as read.`);
  return true;
}
