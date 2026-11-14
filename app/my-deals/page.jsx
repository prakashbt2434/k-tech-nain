"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useTranslation } from "../../lib/useTranslation";

// Helper function to determine if a deal is fully completed
// A deal is completed ONLY when both buyer and farmer have confirmed
// This derived status will be used for future feedback eligibility
const isDealCompleted = (deal) => {
  return deal.buyerConfirmed === true && deal.farmerConfirmed === true;
};

export default function MyDealsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [showFeedbackForm, setShowFeedbackForm] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth");
        return;
      }
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchDeals();
    }
  }, [currentUser]);

  const fetchDeals = async () => {
    try {
      const dealsQuery = query(
        collection(db, "deals"),
        where("buyerId", "==", currentUser.uid)
      );
      const dealsSnapshot = await getDocs(dealsQuery);

      const dealsData = await Promise.all(
        dealsSnapshot.docs.map(async (dealDoc) => {
          const dealData = { id: dealDoc.id, ...dealDoc.data() };

          // Fetch product details (guard against legacy deals without productId)
          let productData = null;
          if (dealData.productId) {
            const productDoc = await getDoc(
              doc(db, "products", dealData.productId)
            );
            productData = productDoc.exists()
              ? { id: productDoc.id, ...productDoc.data() }
              : null;
          }

          // Fetch farmer details
          let farmerData = null;
          if (dealData.farmerId) {
            const farmerDoc = await getDoc(doc(db, "users", dealData.farmerId));
            farmerData = farmerDoc.exists() ? farmerDoc.data() : null;
          }

          // Check if feedback already given
          const feedbackQuery = query(
            collection(db, "feedback"),
            where("dealId", "==", dealDoc.id),
            where("authorId", "==", currentUser.uid)
          );
          const feedbackSnapshot = await getDocs(feedbackQuery);
          const hasFeedback = !feedbackSnapshot.empty;

          return {
            ...dealData,
            product: productData,
            farmer: farmerData,
            hasFeedback,
          };
        })
      );

      setDeals(dealsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setLoading(false);
    }
  };

  const confirmDeal = async (dealId, alreadyConfirmed) => {
    if (alreadyConfirmed) {
      alert(t("myDeals.alreadyConfirmed"));
      return;
    }

    setConfirming(dealId);
    try {
      const dealRef = doc(db, "deals", dealId);
      await updateDoc(dealRef, {
        buyerConfirmed: true,
      });

      // Update local state
      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === dealId ? { ...deal, buyerConfirmed: true } : deal
        )
      );

      // Email delivery is not wired up yet (see functions/index.js), so don't
      // promise an email here.
      alert(t("myDeals.confirmSuccess"));
    } catch (error) {
      console.error("Error confirming deal:", error);
      alert(t("myDeals.confirmError"));
    } finally {
      setConfirming(null);
    }
  };

  const submitFeedback = async (dealId, recipientId) => {
    if (!rating || rating < 1 || rating > 5) {
      alert(t("myDeals.ratingRange"));
      return;
    }

    if (comment.length > 200) {
      alert(t("myDeals.commentTooLong"));
      return;
    }

    setSubmittingFeedback(true);
    try {
      // Create feedback document. Deterministic ID = one review per deal per
      // author, even on double-submit.
      await setDoc(doc(db, "feedback", `${dealId}_${currentUser.uid}`), {
        dealId,
        authorId: currentUser.uid,
        recipientId,
        rating,
        comment: comment.trim() || null,
        createdAt: serverTimestamp(),
      });

      // Update local state
      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === dealId ? { ...deal, hasFeedback: true } : deal
        )
      );

      setShowFeedbackForm(null);
      setRating(5);
      setComment("");
      alert(t("myDeals.feedbackSuccess"));
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(t("myDeals.feedbackError"));
    } finally {
      setSubmittingFeedback(false);
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
        <p style={{ color: "var(--color-text-secondary)" }}>{t("myDeals.loading")}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1000,
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
        {t("myDeals.title")}
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-text-secondary)",
          marginBottom: 32,
        }}
      >
        {t("myDeals.subtitle")}
      </p>

      {deals.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#F9FAFB",
            borderRadius: 8,
          }}
        >
          <p
            style={{
              fontSize: 16,
              color: "var(--color-text-secondary)",
              marginBottom: 20,
            }}
          >
            {t("myDeals.empty")}
          </p>
          <Link
            href="/browse"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-white)",
              background: "var(--color-primary)",
              border: "none",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            {t("myDeals.browseProducts")}
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {deals.map((deal) => {
            // Derived completion status - no database field needed
            const isCompleted = isDealCompleted(deal);

            return (
              <div
                key={deal.id}
                style={{
                  border: isCompleted
                    ? "2px solid #10B981"
                    : "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: 20,
                  background: isCompleted ? "#F0FDF4" : "var(--color-white)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 250 }}>
                    {deal.product ? (
                      <>
                        <Link
                          href={`/product/${deal.productId}`}
                          style={{
                            fontSize: 20,
                            fontWeight: 600,
                            color: "var(--color-primary)",
                            textDecoration: "none",
                            marginBottom: 8,
                            display: "block",
                          }}
                        >
                          {deal.product.cropName}
                        </Link>
                        <p
                          style={{
                            fontSize: 16,
                            color: "var(--color-text-primary)",
                            marginBottom: 8,
                          }}
                        >
                          {t("myDeals.pricePerKg", {
                            price: parseFloat(deal.product.price).toFixed(2),
                          })}
                        </p>
                      </>
                    ) : (
                      <p
                        style={{
                          fontSize: 16,
                          color: "#9CA3AF",
                        }}
                      >
                        {t("myDeals.productUnavailable")}
                      </p>
                    )}

                    {deal.farmer && (
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--color-text-secondary)",
                          marginTop: 8,
                        }}
                      >
                        {t("myDeals.farmer")}{" "}
                        <Link
                          href={`/farmer-profile/${deal.farmerId}`}
                          style={{
                            color: "var(--color-primary)",
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                        >
                          {deal.farmer.name}
                        </Link>
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          padding: "4px 10px",
                          borderRadius: 12,
                          background: deal.buyerConfirmed
                            ? "#D1FAE5"
                            : "#F3F4F6",
                          color: deal.buyerConfirmed ? "#065F46" : "#6B7280",
                        }}
                      >
                        {deal.buyerConfirmed
                          ? t("myDeals.youConfirmed")
                          : t("myDeals.awaitingYou")}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          padding: "4px 10px",
                          borderRadius: 12,
                          background: deal.farmerConfirmed
                            ? "#D1FAE5"
                            : "#F3F4F6",
                          color: deal.farmerConfirmed ? "#065F46" : "#6B7280",
                        }}
                      >
                        {deal.farmerConfirmed
                          ? t("myDeals.farmerConfirmed")
                          : t("myDeals.farmerNotConfirmed")}
                      </span>
                      {isCompleted && (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: 12,
                            background: "#10B981",
                            color: "var(--color-white)",
                          }}
                        >
                          {t("myDeals.dealCompleted")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {deal.buyerConfirmed ? (
                      <div
                        style={{
                          padding: "10px 20px",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#065F46",
                          background: "#D1FAE5",
                          border: "2px solid #10B981",
                          borderRadius: 6,
                        }}
                      >
                        {t("myDeals.confirmed")}
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          confirmDeal(deal.id, deal.buyerConfirmed)
                        }
                        disabled={confirming === deal.id}
                        style={{
                          padding: "12px 24px",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--color-white)",
                          background:
                            confirming === deal.id
                              ? "#9CA3AF"
                              : "var(--color-primary)",
                          border: "none",
                          borderRadius: 6,
                          cursor:
                            confirming === deal.id ? "not-allowed" : "pointer",
                          minHeight: 44,
                        }}
                      >
                        {confirming === deal.id
                          ? t("myDeals.confirming")
                          : t("myDeals.confirmDeal")}
                      </button>
                    )}
                  </div>
                </div>

                {!deal.buyerConfirmed && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: 12,
                      background: "#FFFBEB",
                      border: "1px solid #FDE68A",
                      borderRadius: 6,
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
                      <strong>{t("myDeals.note")}</strong>{" "}
                      {t("myDeals.confirmHint")}
                    </p>
                  </div>
                )}

                {isCompleted && (
                  <>
                    <div
                      style={{
                        marginTop: 16,
                        padding: 16,
                        background: "#D1FAE5",
                        border: "2px solid #10B981",
                        borderRadius: 6,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 14,
                          color: "#065F46",
                          margin: 0,
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {t("myDeals.completedSuccess")}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#065F46",
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {t("myDeals.bothConfirmed")}
                      </p>
                    </div>

                    {/* Feedback Section */}
                    {deal.hasFeedback ? (
                      <div
                        style={{
                          marginTop: 16,
                          padding: 12,
                          background: "#F3F4F6",
                          border: "1px solid #D1D5DB",
                          borderRadius: 6,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 13,
                            color: "#6B7280",
                            margin: 0,
                          }}
                        >
                          {t("myDeals.feedbackGiven")}
                        </p>
                      </div>
                    ) : showFeedbackForm === deal.id ? (
                      <div
                        style={{
                          marginTop: 16,
                          padding: 16,
                          background: "#F9FAFB",
                          border: "1px solid #E5E7EB",
                          borderRadius: 6,
                        }}
                      >
                        <h4
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--color-text-primary)",
                            marginBottom: 12,
                          }}
                        >
                          {t("myDeals.leaveFeedback")}
                        </h4>
                        <div style={{ marginBottom: 12 }}>
                          <label
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: "var(--color-text-secondary)",
                              display: "block",
                              marginBottom: 6,
                            }}
                          >
                            {t("myDeals.ratingLabel")}
                          </label>
                          <div style={{ display: "flex", gap: 8 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 24,
                                  color: star <= rating ? "#F59E0B" : "#D1D5DB",
                                }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <label
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: "var(--color-text-secondary)",
                              display: "block",
                              marginBottom: 6,
                            }}
                          >
                            {t("myDeals.commentLabel")}
                          </label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={200}
                            placeholder={t("myDeals.commentPlaceholder")}
                            style={{
                              width: "100%",
                              minHeight: 80,
                              padding: 10,
                              fontSize: 14,
                              borderRadius: 6,
                              border: "1px solid #E5E7EB",
                              resize: "vertical",
                            }}
                          />
                          <p
                            style={{
                              fontSize: 12,
                              color: "#9CA3AF",
                              marginTop: 4,
                              textAlign: "right",
                            }}
                          >
                            {comment.length}/200
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() =>
                              submitFeedback(deal.id, deal.farmerId)
                            }
                            disabled={submittingFeedback}
                            style={{
                              padding: "8px 16px",
                              fontSize: 14,
                              fontWeight: 600,
                              color: "var(--color-white)",
                              background: submittingFeedback
                                ? "#9CA3AF"
                                : "var(--color-primary)",
                              border: "none",
                              borderRadius: 6,
                              cursor: submittingFeedback
                                ? "not-allowed"
                                : "pointer",
                            }}
                          >
                            {submittingFeedback ? t("myDeals.submitting") : t("myDeals.submit")}
                          </button>
                          <button
                            onClick={() => {
                              setShowFeedbackForm(null);
                              setRating(5);
                              setComment("");
                            }}
                            disabled={submittingFeedback}
                            style={{
                              padding: "8px 16px",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "var(--color-text-primary)",
                              background: "transparent",
                              border: "1px solid #E5E7EB",
                              borderRadius: 6,
                              cursor: submittingFeedback
                                ? "not-allowed"
                                : "pointer",
                            }}
                          >
                            {t("myDeals.cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowFeedbackForm(deal.id)}
                        style={{
                          marginTop: 16,
                          padding: "8px 16px",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--color-primary)",
                          background: "transparent",
                          border: "2px solid var(--color-primary)",
                          borderRadius: 6,
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        {t("myDeals.leaveFeedback")}
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
