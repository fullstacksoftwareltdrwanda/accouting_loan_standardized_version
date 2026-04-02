import { Notification } from "@/types/notification";
import { MOCK_NOTIFICATIONS } from "@/data/mock/notifications";

/**
 * NOTIFICATION SERVICE: Production-ready backend skeleton.
 * Ready for Socket.io or Push service integration.
 */

export async function getNotifications(): Promise<Notification[]> {
  // TODO: Replace with backend API call
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [...MOCK_NOTIFICATIONS];
}

export async function markAsRead(id: string): Promise<boolean> {
  // TODO: PATCH to backend
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(`Notification ${id} marked as read.`);
  return true;
}

export async function clearAll(): Promise<boolean> {
  // TODO: DELETE all for user in backend
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("All notifications cleared from database.");
  return true;
}
