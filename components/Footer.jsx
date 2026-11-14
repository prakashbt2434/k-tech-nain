"use client";

import Link from "next/link";
import { useTranslation } from "../lib/useTranslation";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      style={{
        background: "var(--color-white)",
        borderTop: "1px solid #E5E7EB",
        padding: "clamp(40px, 6vw, 64px) 20px clamp(24px, 4vw, 32px) 20px",
        marginTop: "clamp(48px, 8vw, 80px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Three-column layout - stacks on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(32px, 6vw, 48px)",
            marginBottom: "clamp(32px, 6vw, 48px)",
          }}
        >
          {/* Column 1: Identity */}
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--color-text-primary)",
                margin: "0 0 12px 0",
              }}
            >
              Farm To Table
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-secondary)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {t("footer.tagline")}
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--color-text-primary)",
                margin: "0 0 12px 0",
              }}
            >
              {t("footer.quickLinks")}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li style={{ marginBottom: 8 }}>
                <Link
                  href="/browse"
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    display: "block",
                    padding: "8px 0",
                  }}
                >
                  {t("footer.browse")}
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link
                  href="/auth"
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    display: "block",
                    padding: "8px 0",
                  }}
                >
                  {t("footer.farmerLogin")}
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link
                  href="/profile"
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    display: "block",
                    padding: "8px 0",
                  }}
                >
                  {t("footer.profile")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    display: "block",
                    padding: "8px 0",
                  }}
                >
                  {t("footer.about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Contact */}
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--color-text-primary)",
                margin: "0 0 12px 0",
              }}
            >
              {t("footer.legal")}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 16px 0",
              }}
            >
              <li style={{ marginBottom: 8 }}>
                <Link
                  href="/terms"
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    display: "block",
                    padding: "8px 0",
                  }}
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link
                  href="/privacy"
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    display: "block",
                    padding: "8px 0",
                  }}
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link
                  href="/#verification"
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    display: "block",
                    padding: "8px 0",
                  }}
                >
                  {t("footer.verification")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#disclaimer"
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    display: "block",
                    padding: "8px 0",
                  }}
                >
                  {t("footer.disclaimer")}
                </Link>
              </li>
            </ul>
            <div style={{ marginTop: 16 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                  margin: "0 0 6px 0",
                }}
              >
                {t("footer.contact")}
              </p>
              <a
                href="mailto:anupamashetter@gmail.com"
                style={{
                  fontSize: 14,
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "var(--color-text-secondary)")
                }
              >
                anupamashetter@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            paddingTop: "clamp(24px, 4vw, 32px)",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#6B7280",
              margin: 0,
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            {t("footer.disclaimerText")}
          </p>
        </div>

        {/* Creator Credit & Copyright */}
        <div
          style={{
            paddingTop: 16,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              margin: "0 0 8px 0",
            }}
          >
            {t("footer.createdBy")}{" "}
            <a
              href="https://sanjanb.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#9CA3AF",
                textDecoration: "none",
                borderBottom: "1px solid transparent",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.borderBottomColor = "#9CA3AF")
              }
              onMouseLeave={(e) =>
                (e.target.style.borderBottomColor = "transparent")
              }
            >
              Sanjan B M
            </a>
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              margin: 0,
            }}
          >
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
