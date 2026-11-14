"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "../../lib/useTranslation";
import { auth, db, storage } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddProductPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [cropName, setCropName] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);

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
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data?.role !== "farmer") {
            router.replace("/");
            return;
          }
          setRole(data.role);
        }
        setUser(currentUser);
      } else {
        router.replace("/auth");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // eslint-disable-next-line no-console
      console.log("Starting product submission...");

      let imageUrl = null;

      if (image) {
        // Check file size (max 500KB for performance)
        if (image.size > 500000) {
          setError(
            t("productForm.imageTooLarge")
          );
          setSubmitting(false);
          return;
        }

        // eslint-disable-next-line no-console
        console.log("Converting image to Base64...");
        imageUrl = await convertImageToBase64(image);
        // eslint-disable-next-line no-console
        console.log("Image converted successfully");
      }

      // eslint-disable-next-line no-console
      console.log("Saving product to Firestore...");
      const productData = {
        cropName,
        category,
        price: parseFloat(price),
        quantity,
        imageUrl,
        farmerId: user.uid,
        status: "available",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "products"), productData);
      // eslint-disable-next-line no-console
      console.log("Product added successfully!");

      router.push("/farmer");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error adding product:", err);

      // Better error messages
      let errorMessage = t("productForm.addFailed");
      if (err?.message?.includes("offline")) {
        errorMessage =
          t("productForm.offline");
      } else if (err?.message?.includes("permission")) {
        errorMessage =
          t("productForm.permissionAdd");
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

  if (!user || role !== "farmer") return null;

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: "40px 20px",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "var(--color-text-primary)",
          marginBottom: 8,
        }}
      >
        {t("productForm.addTitle")}
      </h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: 32,
        }}
      >
        {t("productForm.addSubtitle")}
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

        <div style={fieldStyle}>
          <label style={labelStyle}>{t("productForm.image")}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={inputStyle}
          />
          <p
            style={{
              fontSize: 12,
              color: "var(--color-text-secondary)",
              marginTop: 4,
              marginBottom: 0,
            }}
          >
            {t("productForm.imageTip")}
          </p>
        </div>

        {/* Payment Details Info */}
        <div
          style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#1E40AF",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            💡 <strong>{t("productForm.tip")}</strong>{" "}
            {t("productForm.upiTipBefore")}{" "}
            <Link href="/profile" style={{ color: "#1E40AF", fontWeight: 600 }}>
              {t("productForm.profileLink")}
            </Link>{" "}
            {t("productForm.upiTipAfter")}
          </p>
        </div>

        {error && (
          <div style={{ color: "#B91C1C", fontSize: 14, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
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
          {submitting ? t("productForm.adding") : t("productForm.addButton")}
        </button>
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
