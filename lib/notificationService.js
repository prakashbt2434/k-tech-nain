/**
 * Notification Service - Client Side
 * Handles UI feedback and notification state management
 * Does NOT send actual notifications (done server-side via Firebase Functions)
 */

import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NOTIFICATION_STATUS } from "./notificationEvents";

// NOTE: Notification log entries are created ONLY by the Cloud Function
// `onDealConfirmation` (functions/index.js) when both parties confirm.
// The old client-side queueNotification()/queueDealNotifications() helpers were
// removed: if used they would have created duplicate logs (one from the
// client, one from the function), and firestore.rules now blocks client writes
// to notification_logs.

/**
 * Get notification history for a specific deal
 * @param {string} dealId - Deal ID
 * @returns {Promise<array>} - Array of notification logs
 */
export async function getDealNotificationHistory(dealId) {
  try {
    const logsQuery = query(
      collection(db, "notification_logs"),
      where("dealId", "==", dealId)
    );

    const logsSnapshot = await getDocs(logsQuery);
    const logs = logsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastAttemptAt: doc.data().lastAttemptAt?.toDate(),
      sentAt: doc.data().sentAt?.toDate(),
    }));

    // Sort by creation date descending
    logs.sort((a, b) => b.createdAt - a.createdAt);

    return logs;
  } catch (error) {
    console.error("Error fetching notification history:", error);
    return [];
  }
}

/**
 * Get user's notification history
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of logs to fetch
 * @returns {Promise<array>} - Array of notification logs
 */
export async function getUserNotificationHistory(userId, limit = 50) {
  try {
    const logsQuery = query(
      collection(db, "notification_logs"),
      where("recipientId", "==", userId)
    );

    const logsSnapshot = await getDocs(logsQuery);
    let logs = logsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastAttemptAt: doc.data().lastAttemptAt?.toDate(),
      sentAt: doc.data().sentAt?.toDate(),
    }));

    // Sort by creation date descending
    logs.sort((a, b) => b.createdAt - a.createdAt);

    // Apply limit
    if (limit) {
      logs = logs.slice(0, limit);
    }

    return logs;
  } catch (error) {
    console.error("Error fetching user notification history:", error);
    return [];
  }
}

/**
 * Check if user has received notification for a specific event
 * @param {string} userId - User ID
 * @param {string} eventType - Event type
 * @param {string} dealId - Deal ID
 * @returns {Promise<boolean>} - True if notification was sent
 */
export async function hasReceivedNotification(userId, eventType, dealId) {
  try {
    const logsQuery = query(
      collection(db, "notification_logs"),
      where("recipientId", "==", userId),
      where("eventType", "==", eventType),
      where("dealId", "==", dealId),
      where("status", "==", NOTIFICATION_STATUS.SENT)
    );

    const logsSnapshot = await getDocs(logsQuery);
    return !logsSnapshot.empty;
  } catch (error) {
    console.error("Error checking notification status:", error);
    return false;
  }
}

/**
 * UI Helper: Show notification feedback toast/banner
 * @param {string} message - Message to display
 * @param {string} type - 'success' | 'error' | 'info'
 */
export function showNotificationFeedback(message, type = "info") {
  // This is a simple implementation
  // In production, integrate with your toast/notification UI library
  console.log(`[Notification ${type.toUpperCase()}]:`, message);

  // For now, use browser alert
  // TODO: Replace with proper toast notification UI
  if (type === "success") {
    alert(`✓ ${message}`);
  } else if (type === "error") {
    alert(`✗ ${message}`);
  } else {
    alert(message);
  }
}
