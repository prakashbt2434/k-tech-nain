"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useTranslation } from "../../../lib/useTranslation";

export default function ProductDetailPage() {
  const params = useParams();
  const { t, language } = useTranslation();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [creatingDeal, setCreatingDeal] = useState(false);
  const [existingDeal, setExistingDeal] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (!productDoc.exists()) {
          setError(t("product.notFound"));
          setLoading(false);
          return;
        }

        const productData = { id: productDoc.id, ...productDoc.data() };
        setProduct(productData);

        const farmerDoc = await getDoc(doc(db, "users", productData.farmerId));
        if (farmerDoc.exists()) {
          setFarmer(farmerDoc.data());
        }

        // Check if deal already exists for current user
        if (currentUser) {
          const dealsQuery = query(
            collection(db, "deals"),
            where("buyerId", "==", currentUser.uid),
            where("productId", "==", productId)
          );
          const dealsSnapshot = await getDocs(dealsQuery);
          if (!dealsSnapshot.empty) {
            setExistingDeal(dealsSnapshot.docs[0].data());
          }
        }
      } catch (err) {
        // Check if error is due to offline/connectivity
        if (err?.message?.includes("offline")) {
          setError(
            t("errors.firebaseOffline")
          );
        } else {
          setError(err?.message || t("product.loadFailed"));
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId, currentUser]);

  const createDeal = async () => {
    if (!currentUser) {
      alert(t("product.loginToExpress"));
      return;
    }

    if (currentUser.uid === product.farmerId) {
      alert(t("product.ownProduct"));
      return;
    }

    if ((product.status || "available") === "sold") {
      alert(t("product.soldOut"));
      return;
    }

    if (existingDeal) {
      alert(t("product.alreadyInterested"));
      return;
    }

    setCreatingDeal(true);
    try {
      const dealData = {
        buyerId: currentUser.uid,
        farmerId: product.farmerId,
        productId: product.id,
        buyerConfirmed: false,
        farmerConfirmed: false,
        createdAt: serverTimestamp(),
      };

      // Guard against duplicate deals (double-clicks, two tabs): re-check the
      // server, then write with a deterministic ID so a retry can't create a
      // second document. Firestore rules also block overwriting it.
      const existingSnapshot = await getDocs(
        query(
          collection(db, "deals"),
          where("buyerId", "==", currentUser.uid),
          where("productId", "==", product.id)
        )
      );
      if (!existingSnapshot.empty) {
        setExistingDeal(existingSnapshot.docs[0].data());
        alert(t("product.alreadyInterested"));
        return;
      }

      await setDoc(
        doc(db, "deals", `${product.id}_${currentUser.uid}`),
        dealData
      );
      setExistingDeal(dealData);
      alert(t("product.interestSuccess"));
    } catch (err) {
      console.error("Error creating deal:", err);
      alert(t("product.dealFailed"));
    } finally {
      setCreatingDeal(false);
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
        <p style={{ color: "var(--color-text-secondary)" }}>{t("product.loading")}</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          padding: "40px 20px",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <div style={{ color: "#B91C1C", marginBottom: 20 }}>
          {error || t("product.notFound")}
        </div>
        <Link
          href="/browse"
          style={{
            color: "var(--color-primary)",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {t("product.backToBrowse")}
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: "clamp(24px, 5vw, 40px) 20px",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <Link
        href="/browse"
        style={{
          color: "var(--color-primary)",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 500,
          marginBottom: "clamp(24px, 4vw, 32px)",
          display: "inline-block",
        }}
      >
        {t("product.backToBrowse")}
      </Link>

      <div
        style={{
          background: "var(--color-white)",
          borderRadius: 8,
          padding: "clamp(20px, 4vw, 32px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.cropName}
            style={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 8,
              marginBottom: 32,
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 8,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {product.cropName}
          </h1>
          {(product.status || "available") === "sold" && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 6,
                background: "#FEE2E2",
                color: "#991B1B",
                whiteSpace: "nowrap",
              }}
            >
              {t("product.sold")}
            </span>
          )}
        </div>

        <p
          style={{
            fontSize: "clamp(20px, 4vw, 24px)",
            fontWeight: 600,
            color: "var(--color-primary)",
            marginBottom: "clamp(20px, 4vw, 24px)",
            margin: 0,
            marginTop: 8,
          }}
        >
          {t("product.pricePerKg", { price: parseFloat(product.price).toFixed(2) })}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "clamp(16px, 3vw, 24px)",
            marginBottom: "clamp(24px, 4vw, 32px)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                color: "var(--color-text-secondary)",
                margin: "0 0 4px 0",
                fontWeight: 600,
              }}
            >
              {t("product.availableQuantity")}
            </p>
            <p
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {product.quantity}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                color: "var(--color-text-secondary)",
                margin: "0 0 4px 0",
                fontWeight: 600,
              }}
            >
              {t("product.posted")}
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {product.createdAt
                ? new Date(product.createdAt.toDate()).toLocaleDateString(
                    language === "kn" ? "kn-IN" : "en-IN"
                  )
                : t("product.na")}
            </p>
          </div>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #E5E7EB",
            margin: "32px 0",
          }}
        />

        {/* Sold By Section */}
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              margin: 0,
              marginBottom: 8,
            }}
          >
            {t("product.soldBy")}{" "}
            {farmer ? (
              <>
                <Link
                  href={`/farmer-profile/${product.farmerId}`}
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  {farmer.name}
                </Link>
                {farmer.isVerified && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      fontWeight: 500,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "#D1FAE5",
                      color: "#065F46",
                    }}
                  >
                    {t("product.verified")}
                  </span>
                )}
              </>
            ) : (
              <span style={{ fontWeight: 600, fontSize: 16 }}>{t("product.unknown")}</span>
            )}
          </p>
        </div>

        {/* Express Interest Section (Buyers Only) */}
        {currentUser && currentUser.uid !== product.farmerId && (
          <div
            style={{
              border: "2px solid var(--color-primary)",
              borderRadius: 8,
              padding: "clamp(20px, 4vw, 24px)",
              marginBottom: "clamp(24px, 4vw, 32px)",
              background: "#F0F9FF",
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--color-text-primary)",
                margin: 0,
                marginBottom: 12,
              }}
            >
              {t("product.interestedTitle")}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-secondary)",
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              {t("product.interestedText")}
            </p>

            {existingDeal ? (
              <div
                style={{
                  background: "#D1FAE5",
                  border: "1px solid #10B981",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color: "#065F46",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {t("product.alreadyExpressed")}
                </p>
              </div>
            ) : (
              <button
                onClick={createDeal}
                disabled={creatingDeal}
                style={{
                  padding: "14px 28px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--color-white)",
                  background: creatingDeal ? "#9CA3AF" : "var(--color-primary)",
                  border: "none",
                  borderRadius: 6,
                  cursor: creatingDeal ? "not-allowed" : "pointer",
                  minHeight: 48,
                }}
              >
                {creatingDeal ? t("product.creatingDeal") : t("product.expressInterest")}
              </button>
            )}
          </div>
        )}

        {/* Payment/Contact Section */}
        <div
          style={{
            border: "2px solid #E5E7EB",
            borderRadius: 8,
            padding: "clamp(20px, 4vw, 24px)",
            marginBottom: "clamp(24px, 4vw, 32px)",
            background: "var(--color-white)",
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              margin: 0,
              marginBottom: 16,
            }}
          >
            {t("product.paymentContact")}
          </h2>

          {/* Show QR payment option if farmer has provided it */}
          {farmer && (farmer.upiId || farmer.qrCodeUrl) && (
            <div
              style={{
                background: "#F0F9FF",
                border: "2px solid var(--color-primary)",
                borderRadius: 8,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                {t("product.payViaUpi")}
              </h3>

              {farmer.qrCodeUrl && (
                <div style={{ marginBottom: 16, textAlign: "center" }}>
                  <img
                    src={farmer.qrCodeUrl}
                    alt={t("product.qrAlt")}
                    style={{
                      maxWidth: 250,
                      height: "auto",
                      border: "2px solid #E5E7EB",
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  />
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                      margin: 0,
                    }}
                  >
                    {t("product.scanToPay")} <strong>{farmer.name}</strong>
                  </p>
                </div>
              )}

              {farmer.upiId && (
                <div style={{ marginBottom: 8 }}>
                  <p
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      color: "var(--color-text-secondary)",
                      margin: "0 0 4px 0",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {t("product.upiId")}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "var(--color-white)",
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        margin: 0,
                        flex: 1,
                        fontFamily: "monospace",
                      }}
                    >
                      {farmer.upiId}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(farmer.upiId);
                        alert(t("product.upiCopied"));
                      }}
                      style={{
                        padding: "6px 12px",
                        fontSize: 12,
                        fontWeight: 500,
                        background: "var(--color-primary)",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      {t("product.copy")}
                    </button>
                  </div>
                </div>
              )}

              <div
                style={{
                  background: "#DBEAFE",
                  border: "1px solid #93C5FD",
                  borderRadius: 6,
                  padding: 10,
                  marginTop: 12,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: "#1E40AF",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  <strong>{t("product.directPaymentTitle")}</strong> -{" "}
                  {t("product.directPaymentText")}
                </p>
              </div>
            </div>
          )}

          {/* Contact information */}
          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                color: "var(--color-text-secondary)",
                margin: "0 0 4px 0",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              {t("product.email")}
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {farmer?.email || t("product.na")}
            </p>
          </div>

          {/* Fallback message if no QR payment */}
          {farmer && !farmer.upiId && !farmer.qrCodeUrl && (
            <div
              style={{
                background: "#FEF3C7",
                border: "1px solid #FCD34D",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "#92400E",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                <strong>{t("product.note")}</strong> {t("product.noQrText")}
              </p>
            </div>
          )}
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #E5E7EB",
            margin: "32px 0",
          }}
        />

        <div
          style={{
            background: "#FEF3C7",
            border: "1px solid #FCD34D",
            borderRadius: 8,
            padding: "clamp(16px, 3vw, 20px)",
            marginTop: "clamp(24px, 4vw, 32px)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#92400E",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            <strong>{t("product.disclaimerLabel")}</strong>{" "}
            {t("product.disclaimerText")}
          </p>
        </div>
      </div>
    </div>
  );
}
