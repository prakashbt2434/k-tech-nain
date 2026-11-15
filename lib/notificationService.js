/**
 * Notification Service - In-app notifications (Firebase Spark / free plan)
 *
 * There are no Cloud Functions and no email. When a deal becomes confirmed
 * by both parties, the client that made the final confirmation writes one
 * notification_logs entry per party. Users see them on /notifications.
 *
 * Each entry has a deterministic ID (dealId_eventType_recipientId), so a
 * second write for the same event is rejected by the Firestore rules instead
 * of creating a duplicate. See the notification_logs rules in firestore.rules.
 */

import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_EVENTS,
  isDealConfirmed,
} from "./notificationEvents";

export function notificationId(dealId, eventType, recipientId) {
  return `${dealId}_${eventType}_${recipientId}`;
}

/**
 * Call after a party confirms a deal. Re-reads the deal from the server and,
 * if both parties have now confirmed, creates a notification for each.
 * Never throws: a failed notification must not undo or hide a confirmation.
 * @param {string} dealId
 * @returns {Promise<boolean>} true if the deal is now confirmed by both parties
 */
export async function notifyIfDealConfirmed(dealId) {
  let deal;
  try {
    const snap = await getDoc(doc(db, "deals", dealId));
    if (!snap.exists()) return false;
    deal = snap.data();
  } catch (error) {
    console.error("Could not re-read deal for notifications:", error);
    return false;
  }

  if (!isDealConfirmed(deal)) return false;

  const eventType = NOTIFICATION_EVENTS.DEAL_CONFIRMED;
  const results = await Promise.allSettled(
    [deal.buyerId, deal.farmerId].map((recipientId) =>
      setDoc(
        doc(db, "notification_logs", notificationId(dealId, eventType, recipientId)),
        {
          eventType,
          dealId,
          productId: deal.productId,
          recipientId,
          channel: NOTIFICATION_CHANNELS.IN_APP,
          read: false,
          createdAt: serverTimestamp(),
        }
      )
    )
  );

  results.forEach((result) => {
    // permission-denied here usually means the other party already created
    // this notification (the rules forbid overwriting it), which is fine.
    if (result.status === "rejected" && result.reason?.code !== "permission-denied") {
      console.error("Error creating notification:", result.reason);
    }
  });

  return true;
}

/**
 * Fetch the signed-in user's notifications, newest first.
 * @param {string} userId
 * @returns {Promise<array>}
 */
export async function getUserNotifications(userId) {
  const snap = await getDocs(
    query(collection(db, "notification_logs"), where("recipientId", "==", userId))
  );
  return snap.docs
    .map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() ?? null,
    }))
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

/**
 * Count unread notifications for the navigation badge.
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function getUnreadNotificationCount(userId) {
  try {
    const snap = await getDocs(
      query(
        collection(db, "notification_logs"),
        where("recipientId", "==", userId),
        where("read", "==", false)
      )
    );
    return snap.size;
  } catch (error) {
    console.error("Error counting notifications:", error);
    return 0;
  }
}

/**
 * Mark the given notifications as read.
 * @param {string[]} ids
 */
export async function markNotificationsRead(ids) {
  await Promise.allSettled(
    ids.map((id) => updateDoc(doc(db, "notification_logs", id), { read: true }))
  );
}
