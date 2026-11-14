"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useTranslation } from "../../lib/useTranslation";
import { LANGUAGE_INFO, SUPPORTED_LANGUAGES } from "../../lib/i18n";

// Map Firebase Auth error codes to friendly, translatable messages
const AUTH_ERROR_KEYS = {
  "auth/invalid-credential": "authPage.errInvalidCredential",
  "auth/wrong-password": "authPage.errInvalidCredential",
  "auth/user-not-found": "authPage.errInvalidCredential",
  "auth/email-already-in-use": "authPage.errEmailInUse",
  "auth/weak-password": "authPage.errWeakPassword",
  "auth/invalid-email": "authPage.errInvalidEmail",
  "auth/too-many-requests": "authPage.errTooMany",
  "auth/network-request-failed": "authPage.errNetwork",
};

export default function AuthPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const otherLanguage =
    language === SUPPORTED_LANGUAGES.KN ? SUPPORTED_LANGUAGES.EN : SUPPORTED_LANGUAGES.KN;
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("buyer"); // 'farmer' | 'buyer'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        if (!name.trim()) throw new Error(t("authPage.nameRequired"));
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        const { uid } = cred.user;
        await setDoc(doc(db, "users", uid), {
          uid,
          name: name.trim(),
          email: cred.user.email,
          phoneNumber: phoneNumber.trim() || null,
          role,
          createdAt: new Date(),
          isVerified: false,
          language,
        });
        // Redirect based on selected role
        router.replace(role === "farmer" ? "/farmer" : "/browse");
      } else {
        const cred = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        const { uid } = cred.user;
        const snap = await getDoc(doc(db, "users", uid));
        if (!snap.exists()) {
          throw new Error(t("authPage.profileNotFound"));
        }
        const data = snap.data();
        const userRole = data?.role === "farmer" ? "farmer" : "buyer";
        router.replace(userRole === "farmer" ? "/farmer" : "/browse");
      }
    } catch (err) {
      const key = AUTH_ERROR_KEYS[err?.code];
      setError(key ? t(key) : err?.message || t("authPage.errGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#F1F8F4",
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 400,
          position: "relative",
          background: "#FFFFFF",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <h1
          style={{
            margin: 0,
            marginBottom: 16,
            color: "#1F2933",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          {mode === "login" ? t("authPage.login") : t("authPage.register")}
        </h1>
        <button
          type="button"
          onClick={() => setLanguage(otherLanguage, { persistToProfile: false })}
          lang={otherLanguage}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "transparent",
            border: "1px solid #D1D5DB",
            borderRadius: 16,
            padding: "4px 12px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {LANGUAGE_INFO[otherLanguage].nativeName}
        </button>

        {mode === "register" && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label
                style={{ display: "block", marginBottom: 6, color: "#6B7280" }}
              >
                {t("authPage.name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 6,
                }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label
                style={{ display: "block", marginBottom: 6, color: "#6B7280" }}
              >
                {t("authPage.phoneOptional")}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 9876543210"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 6,
                }}
              />
            </div>
          </>
        )}

        <div style={{ marginBottom: 12 }}>
          <label
            style={{ display: "block", marginBottom: 6, color: "#6B7280" }}
          >
            {t("authPage.email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #E5E7EB",
              borderRadius: 6,
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label
            style={{ display: "block", marginBottom: 6, color: "#6B7280" }}
          >
            {t("authPage.password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #E5E7EB",
              borderRadius: 6,
            }}
          />
        </div>

        {mode === "register" && (
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 6, color: "#6B7280" }}
            >
              {t("authPage.role")}
            </label>
            <div style={{ display: "flex", gap: 16 }}>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  color: "#1F2933",
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={role === "buyer"}
                  onChange={() => setRole("buyer")}
                />
                {t("authPage.buyer")}
              </label>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  color: "#1F2933",
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={role === "farmer"}
                  onChange={() => setRole("farmer")}
                />
                {t("authPage.farmer")}
              </label>
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: "#B91C1C", fontSize: 14, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 12px",
            background: "#2E7D32",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 500,
            minHeight: 48,
          }}
        >
          {loading
            ? t("authPage.pleaseWait")
            : mode === "login"
            ? t("authPage.login")
            : t("authPage.createAccount")}
        </button>

        <div style={{ marginTop: 12, textAlign: "center" }}>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            style={{
              background: "transparent",
              border: "none",
              color: "#2E7D32",
              cursor: "pointer",
            }}
          >
            {mode === "login"
              ? t("authPage.needAccount")
              : t("authPage.haveAccount")}
          </button>
        </div>

        <p style={{ marginTop: 16, color: "#6B7280", fontSize: 12 }}>
          {t("authPage.noReset")}
        </p>
      </form>
    </div>
  );
}
