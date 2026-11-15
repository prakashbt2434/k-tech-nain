"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  getUserNotifications,
  markNotificationsRead,
} from "../../lib/notificationService";
import { NOTIFICATION_EVENTS } from "../../lib/notificationEvents";

function describe(notification, role) {
  const crop = notification.product?.cropName || "your produce";
  if (notification.eventType === NOTIFICATION_EVENTS.DEAL_CONFIRMED) {
    return role === "farmer"
      ? `Your deal for ${crop} is confirmed by both you and the buyer.`
      : `Your deal for ${crop} is confirmed by both you and the farmer.`;
  }
  return "You have a new update on one of your deals.";
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth");
        return;
      }
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        setRole(userSnap.exists() ? userSnap.data().role : null);

        const items = await getUserNotifications(user.uid);
        const withProducts = await Promise.all(
          items.map(async (n) => {
            if (!n.productId) return n;
            const productSnap = await getDoc(doc(db, "products", n.productId));
            return { ...n, product: productSnap.exists() ? productSnap.data() : null };
          })
        );
        setNotifications(withProducts);

        // Keep the unread highlight on screen, but store them as read.
        const unreadIds = withProducts.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length) {
          await markNotificationsRead(unreadIds);
          window.dispatchEvent(new Event("notifications-read"));
        }
      } catch (err) {
        console.error("Error loading notifications:", err);
        setError("Could not load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const dealsHref = role === "farmer" ? "/farmer" : "/my-deals";

  if (loading) {
    return (
      <div style={centeredStyle}>
        <p style={{ color: "var(--color-text-secondary)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24, color: "var(--color-text-primary)" }}>
        Notifications
      </h1>

      {error && <p style={{ color: "#B91C1C" }}>{error}</p>}

      {!error && notifications.length === 0 && (
        <div style={emptyStyle}>
          <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
            No notifications yet. You will see one here when a deal is
            confirmed by both parties.
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              ...cardStyle,
              borderLeft: n.read
                ? "4px solid #E5E7EB"
                : "4px solid var(--color-primary)",
            }}
          >
            <p style={{ margin: 0, color: "var(--color-text-primary)", fontWeight: n.read ? 400 : 600 }}>
              {describe(n, role)}
            </p>
            <div style={metaRowStyle}>
              <span style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>
                {n.createdAt ? n.createdAt.toLocaleString() : ""}
              </span>
              <Link href={dealsHref} style={{ color: "var(--color-primary)", fontSize: 14 }}>
                View deal
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const centeredStyle = {
  minHeight: "60vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const emptyStyle = {
  background: "var(--color-white)",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  padding: 24,
};

const cardStyle = {
  background: "var(--color-white)",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  padding: 16,
};

const metaRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 8,
  gap: 12,
};
