"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "../../../lib/useTranslation";

export default function AdminVerifyPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState([]);
  const [updating, setUpdating] = useState(null);

  // Admin email - change this to your admin email
  const ADMIN_EMAIL = "admin@farmtotable.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth");
        return;
      }

      // Check if user is admin
      if (user.email !== ADMIN_EMAIL) {
        alert(t("admin.accessDenied"));
        router.push("/");
        return;
      }

      setCurrentUser(user);
      fetchFarmers();
    });

    return () => unsubscribe();
  }, []);

  const fetchFarmers = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "farmer"));
      const snapshot = await getDocs(q);
      const farmersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFarmers(farmersList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      setLoading(false);
    }
  };

  const toggleVerification = async (farmerId, currentStatus) => {
    setUpdating(farmerId);
    try {
      const farmerRef = doc(db, "users", farmerId);
      await updateDoc(farmerRef, {
        isVerified: !currentStatus,
      });

      // Update local state
      setFarmers((prev) =>
        prev.map((farmer) =>
          farmer.id === farmerId
            ? { ...farmer, isVerified: !currentStatus }
            : farmer
        )
      );

      alert(
        t(!currentStatus ? "admin.verifiedSuccess" : "admin.unverifiedSuccess")
      );
    } catch (error) {
      console.error("Error updating verification:", error);
      alert(t("admin.updateFailed"));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>{t("admin.loading")}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginBottom: 8,
        }}
      >
        {t("admin.title")}
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-text-secondary)",
          marginBottom: 32,
        }}
      >
        {t("admin.subtitle")}
      </p>

      {farmers.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)" }}>
          {t("admin.noFarmers")}
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {farmers.map((farmer) => (
            <div
              key={farmer.id}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--color-white)",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: 4,
                  }}
                >
                  {farmer.name}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-secondary)",
                    marginBottom: 4,
                  }}
                >
                  {farmer.email}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: farmer.isVerified ? "#065F46" : "#78716C",
                      background: farmer.isVerified ? "#D1FAE5" : "#F5F5F4",
                      padding: "4px 10px",
                      borderRadius: 12,
                    }}
                  >
                    {farmer.isVerified ? t("admin.verified") : t("admin.notVerified")}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#9CA3AF",
                    }}
                  >
                    {t("admin.uid", { id: farmer.id })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleVerification(farmer.id, farmer.isVerified)}
                disabled={updating === farmer.id}
                style={{
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: farmer.isVerified ? "#B91C1C" : "#065F46",
                  background: "var(--color-white)",
                  border: farmer.isVerified
                    ? "2px solid #B91C1C"
                    : "2px solid var(--color-primary)",
                  borderRadius: 6,
                  cursor: updating === farmer.id ? "not-allowed" : "pointer",
                  opacity: updating === farmer.id ? 0.6 : 1,
                }}
              >
                {updating === farmer.id
                  ? t("admin.updating")
                  : farmer.isVerified
                  ? t("admin.unverify")
                  : t("admin.verify")}
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: 40,
          padding: 16,
          background: "#FFFBEB",
          border: "1px solid #FDE68A",
          borderRadius: 8,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "#92400E",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          <strong>{t("admin.note")}</strong> {t("admin.noteText")}
        </p>
      </div>
    </div>
  );
}
