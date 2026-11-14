"use client";

import Link from "next/link";
import { useTranslation } from "../lib/useTranslation";

/**
 * Renders a long-form legal page (Terms, Privacy) from a structure of
 * translation keys, so the English and Kannada text live in locales/*.json.
 *
 * sections: [{ title, blocks: [
 *   { p: "key" }                       paragraph
 *   { p: "key", label: "key" }         paragraph with bold lead-in
 *   { strong: "key" }                  bold sub-heading paragraph
 *   { ul: ["key", ...], spaced: true }  bullet list
 *   { link: "key", href, prefix: "key" } external link
 *   { pStrong: "key" }                 medium-weight paragraph (e.g. email)
 * ]}]
 */
export default function LegalPage({ ns, sections, callout }) {
  const { t } = useTranslation();
  const k = (key) => t(`${ns}.${key}`);

  const renderBlock = (block, index) => {
    if (block.ul) {
      return (
        <ul
          key={index}
          style={{ marginLeft: 20, marginBottom: block.spaced ? 12 : 0 }}
        >
          {block.ul.map((item) => (
            <li key={item}>{k(item)}</li>
          ))}
        </ul>
      );
    }
    if (block.strong) {
      return (
        <p key={index}>
          <strong>{k(block.strong)}</strong>
        </p>
      );
    }
    if (block.link) {
      return (
        <p key={index}>
          {k(block.prefix)}{" "}
          <a
            href={block.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-primary)" }}
          >
            {k(block.link)}
          </a>
        </p>
      );
    }
    if (block.pStrong) {
      return (
        <p key={index} style={{ fontWeight: 500 }}>
          {k(block.pStrong)}
        </p>
      );
    }
    return (
      <p key={index}>
        {block.label && (
          <>
            <strong>{k(block.label)}</strong>{" "}
          </>
        )}
        {k(block.p)}
      </p>
    );
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "40px 20px",
        minHeight: "calc(100vh - 70px)",
      }}
    >
      <Link
        href="/"
        style={{
          color: "var(--color-text-secondary)",
          textDecoration: "none",
          fontSize: 14,
          marginBottom: 16,
          display: "inline-block",
        }}
      >
        {t("legal.backToHome")}
      </Link>

      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginBottom: 16,
        }}
      >
        {k("title")}
      </h1>

      <p
        style={{
          color: "var(--color-text-secondary)",
          fontSize: 14,
          marginBottom: 32,
        }}
      >
        {k("lastUpdated")}
      </p>

      <div
        style={{
          color: "var(--color-text-primary)",
          lineHeight: 1.8,
          fontSize: 15,
        }}
      >
        {sections.map((section) => (
          <section key={section.title} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
              {k(section.title)}
            </h2>
            {section.blocks.map(renderBlock)}
          </section>
        ))}

        {callout && (
          <section
            style={{
              marginTop: 48,
              padding: 20,
              background: "#F9FAFB",
              borderRadius: 8,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
              {k(callout.title)}
            </h3>
            <p style={{ margin: 0 }}>{k(callout.text)}</p>
          </section>
        )}
      </div>
    </div>
  );
}
