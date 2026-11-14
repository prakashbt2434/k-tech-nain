/**
 * Shown instead of the app when Firebase env vars are missing at build time.
 * Server component on purpose: it must render even when Firebase can't start.
 */
export default function ConfigError({ missing = [] }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#F1F8F4",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          background: "#FFFFFF",
          borderRadius: 8,
          padding: 24,
          border: "1px solid #FCA5A5",
        }}
      >
        <h1 style={{ marginTop: 0, fontSize: 20, color: "#B91C1C" }}>
          Firebase is not configured
        </h1>
        <p style={{ color: "#374151" }}>
          This build was created without the Firebase environment variables, so
          the app cannot connect to its database. Missing:
        </p>
        <ul style={{ color: "#374151", fontFamily: "monospace", fontSize: 13 }}>
          {missing.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <p style={{ color: "#374151", marginBottom: 0 }}>
          Copy <code>.env.example</code> to <code>.env.local</code> (local) or
          add the variables in your hosting provider&apos;s settings, then rebuild.
        </p>
      </div>
    </main>
  );
}
