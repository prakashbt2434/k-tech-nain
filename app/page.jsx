"use client";

import Link from "next/link";
import { useTranslation } from "../lib/useTranslation";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div style={{ minHeight: "calc(100vh - 70px)" }}>
      {/* 1. Hero Section */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(72px, 10vw, 120px) 20px",
          textAlign: "center",
          background: "var(--color-white)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 52px)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            margin: "0 0 12px 0",
            maxWidth: 720,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {t("home.heroTitle")}
        </h1>
        <p
          style={{
            fontSize: "clamp(15px, 2.2vw, 18px)",
            color: "var(--color-text-secondary)",
            maxWidth: 640,
            margin: "0 0 28px 0",
            lineHeight: 1.7,
          }}
        >
          {t("home.heroSubtitle")}
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link href="/browse" style={buttonStyle}>
            {t("home.browse")}
          </Link>
          <Link href="/auth" style={secondaryButtonStyle}>
            {t("home.iAmFarmer")}
          </Link>
        </div>
      </section>

      {/* Trust Strip */}
      <section
        style={{
          padding: "0 20px",
          margin: "0 auto",
          maxWidth: 1100,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
            margin: "clamp(16px, 3vw, 24px) 0",
          }}
        >
          <span style={chipStyle}>{t("home.chipVerified")}</span>
          <span style={chipStyle}>{t("home.chipNoFees")}</span>
          <span style={chipStyle}>{t("home.chipDirect")}</span>
        </div>
      </section>

      {/* 2. How It Works */}
      <section
        style={{
          padding: "clamp(60px, 10vw, 100px) 20px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            textAlign: "center",
            marginBottom: "clamp(32px, 6vw, 48px)",
            letterSpacing: "-0.02em",
          }}
        >
          {t("home.howItWorks")}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(24px, 5vw, 40px)",
          }}
        >
          <div style={stepStyle}>
            <h3 style={stepTitleStyle}>{t("home.step1Title")}</h3>
            <p style={stepTextStyle}>
              {t("home.step1Text")}
            </p>
          </div>
          <div style={stepStyle}>
            <h3 style={stepTitleStyle}>{t("home.step2Title")}</h3>
            <p style={stepTextStyle}>
              {t("home.step2Text")}
            </p>
          </div>
          <div style={stepStyle}>
            <h3 style={stepTitleStyle}>{t("home.step3Title")}</h3>
            <p style={stepTextStyle}>{t("home.step3Text")}</p>
          </div>
        </div>
      </section>

      {/* 3. How Verification Works */}
      <section
        id="verification"
        style={{
          padding: "clamp(60px, 10vw, 100px) 20px",
          maxWidth: 960,
          margin: "0 auto",
          background: "var(--color-white)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={chipStyle}>{t("home.chipTrust")}</span>
        </div>
        <h2
          style={{
            fontSize: "clamp(26px, 4.5vw, 40px)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            textAlign: "center",
            marginBottom: "clamp(20px, 4vw, 28px)",
            letterSpacing: "-0.02em",
          }}
        >
          {t("home.verificationTitle")}
        </h2>
        <div
          style={{
            background: "#F9FAFB",
            padding: "clamp(24px, 4vw, 32px)",
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            borderLeft: "4px solid var(--color-primary)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(16px, 4vw, 24px)",
              marginBottom: 16,
            }}
          >
            {/* Column: What it means */}
            <div>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-text-primary)",
                  lineHeight: 1.7,
                  marginBottom: 10,
                }}
              >
                <strong>{t("home.badgeMeansTitle")}</strong>
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {t("home.badgeMeansText")}
              </p>
            </div>

            {/* Column: Not guaranteed */}
            <div>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-text-primary)",
                  lineHeight: 1.7,
                  marginBottom: 10,
                }}
              >
                <strong>{t("home.notGuaranteeTitle")}</strong>
              </p>
              <ul
                style={{
                  fontSize: 14,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  paddingLeft: 20,
                  margin: 0,
                }}
              >
                <li>{t("home.notGuarantee1")}</li>
                <li>{t("home.notGuarantee2")}</li>
                <li>{t("home.notGuarantee3")}</li>
                <li>{t("home.notGuarantee4")}</li>
              </ul>
            </div>
          </div>

          {/* Note */}
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {t("home.verificationNote")}
          </p>
        </div>
      </section>

      {/* 4. Disclaimer */}
      <section
        id="disclaimer"
        style={{
          padding: "clamp(60px, 10vw, 100px) 20px",
          maxWidth: 960,
          margin: "0 auto",
          background: "var(--color-bg)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={chipStyle}>{t("home.chipImportant")}</span>
        </div>
        <h2
          style={{
            fontSize: "clamp(26px, 4.5vw, 40px)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            textAlign: "center",
            marginBottom: "clamp(20px, 4vw, 28px)",
            letterSpacing: "-0.02em",
          }}
        >
          {t("home.disclaimerTitle")}
        </h2>
        <div
          style={{
            background: "var(--color-white)",
            padding: "clamp(24px, 4vw, 32px)",
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              fontSize: 15,
              color: "var(--color-text-primary)",
              lineHeight: 1.7,
              marginBottom: 16,
            }}
          >
            <strong>{t("home.disclaimerLead")}</strong>
          </p>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              marginBottom: 16,
            }}
          >
            {t("home.disclaimerText")}
          </p>
          <p
            style={{
              fontSize: 15,
              color: "var(--color-text-primary)",
              lineHeight: 1.7,
              marginBottom: 16,
            }}
          >
            <strong>{t("home.weDoNot")}</strong>
          </p>
          <ul
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              paddingLeft: 20,
              marginBottom: 16,
            }}
          >
            <li>{t("home.doNot1")}</li>
            <li>{t("home.doNot2")}</li>
            <li>{t("home.doNot3")}</li>
            <li>{t("home.doNot4")}</li>
            <li>{t("home.doNot5")}</li>
          </ul>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {t("home.ackText")}
          </p>
        </div>
      </section>

      {/* 5. Light CTA */}
      <section
        style={{
          padding: "clamp(60px, 10vw, 100px) 20px clamp(80px, 12vw, 120px)",
          textAlign: "center",
          background: "var(--color-white)",
        }}
      >
        <p
          style={{
            fontSize: "clamp(17px, 2.8vw, 20px)",
            color: "var(--color-text-secondary)",
            maxWidth: 640,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          {t("home.ctaText")}
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link href="/browse" style={buttonStyle}>
            {t("home.browse")}
          </Link>
          <Link href="/auth" style={secondaryButtonStyle}>
            {t("home.iAmFarmer")}
          </Link>
        </div>
      </section>
    </div>
  );
}

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px 32px",
  background: "var(--color-primary)",
  color: "var(--color-white)",
  textDecoration: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 500,
  minHeight: 48,
};

const secondaryButtonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px 32px",
  background: "transparent",
  color: "var(--color-primary)",
  textDecoration: "none",
  border: "2px solid var(--color-primary)",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 500,
  minHeight: 48,
};

const stepStyle = {
  textAlign: "center",
  padding: "16px",
};

const stepTitleStyle = {
  fontSize: "clamp(17px, 2.8vw, 20px)",
  fontWeight: 600,
  color: "var(--color-text-primary)",
  marginBottom: 14,
  letterSpacing: "-0.01em",
};

const stepTextStyle = {
  fontSize: "clamp(14px, 2.2vw, 15px)",
  color: "var(--color-text-secondary)",
  lineHeight: 1.7,
  maxWidth: 320,
  margin: "0 auto",
};

const chipStyle = {
  display: "inline-block",
  padding: "8px 12px",
  background: "transparent",
  color: "var(--color-primary)",
  border: "2px solid var(--color-primary)",
  borderRadius: 9999,
  fontSize: 13,
  fontWeight: 600,
};
