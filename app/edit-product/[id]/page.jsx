"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useTranslation } from "../../../lib/useTranslation";

export default function EditProductPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useParams();
  const productId = params.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [cropName, setCropName] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const categories = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Dairy",
    "Spices",
    "Others",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/auth");
        return;
      }

      try {
        // Fetch product data
        const productDoc = await getDoc(doc(db, "products", productId));

        if (!productDoc.exists()) {
          setError(t("productForm.notFound"));
          setLoading(false);
          return;
        }

        const productData = productDoc.data();

        // Verify ownership
        if (productData.farmerId !== currentUser.uid) {
          setError(t("productForm.noPermission"));
          setLoading(false);
          return;
        }

        // Pre-fill form
        setCropName(productData.cropName || "");
        setCategory(productData.category || "Vegetables");
        setPrice(productData.price?.toString() || "");
        setQuantity(productData.quantity || "");

        setUser(currentUser);
      } catch (err) {
        setError(err?.message || t("productForm.loadFailed"));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const productRef = doc(db, "products", productId);

      await updateDoc(productRef, {
        category,
        cropName,
        price: parseFloat(price),
        quantity,
      });

      router.push("/farmer");
    } catch (err) {
      let errorMessage = t("productForm.updateFailed");
      if (err?.message?.includes("offline")) {
        errorMessage =
          t("productForm.offline");
      } else if (err?.message?.includes("permission")) {
        errorMessage =
          t("productForm.permissionEdit");
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <p style={{ color: "var(--color-text-secondary)" }}>{t("productForm.loading")}</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          padding: "40px 20px",
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <div style={{ color: "#B91C1C", marginBottom: 20 }}>{error}</div>
        <Link
          href="/farmer"
          style={{
            color: "var(--color-primary)",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {t("productForm.backToListings")}
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: "40px 20px",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <Link
        href="/farmer"
        style={{
          color: "var(--color-text-secondary)",
          textDecoration: "none",
          fontSize: 14,
          marginBottom: 24,
          display: "inline-block",
        }}
      >
        {t("productForm.backToListings")}
      </Link>

      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "var(--color-text-primary)",
          marginBottom: 8,
        }}
      >
        {t("productForm.editTitle")}
      </h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: 32,
        }}
      >
        {t("productForm.editSubtitle")}
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--color-white)",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div style={fieldStyle}>
          <label style={labelStyle}>{t("productForm.cropName")}</label>
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            required
            style={inputStyle}
            placeholder={t("productForm.cropPlaceholder")}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>{t("productForm.category")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={inputStyle}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {t(`categories.${cat}`)}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>{t("productForm.price")}</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={inputStyle}
            placeholder={t("productForm.pricePlaceholder")}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>{t("productForm.quantity")}</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            style={inputStyle}
            placeholder={t("productForm.quantityPlaceholder")}
          />
        </div>

        {error && (
          <div style={{ color: "#B91C1C", fontSize: 14, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1,
              padding: "14px 20px",
              background: "var(--color-primary)",
              color: "var(--color-white)",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
              minHeight: 48,
            }}
          >
            {submitting ? t("productForm.updating") : t("productForm.saveChanges")}
          </button>
          <Link
            href="/farmer"
            style={{
              flex: 1,
              padding: "14px 20px",
              background: "transparent",
              color: "var(--color-text-primary)",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              textDecoration: "none",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 48,
            }}
          >
            {t("productForm.cancel")}
          </Link>
        </div>
      </form>
    </div>
  );
}

const fieldStyle = {
  marginBottom: 20,
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontSize: 14,
  fontWeight: 500,
  color: "var(--color-text-primary)",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E5E7EB",
  borderRadius: 6,
  fontSize: 16,
  minHeight: 44,
};
