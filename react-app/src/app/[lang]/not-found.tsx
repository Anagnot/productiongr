import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-orange)",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "12px 0 8px",
          }}
        >
          Page not found
        </h1>
        <p style={{ color: "var(--fg-secondary)", margin: "0 0 4px" }}>
          The page you are looking for has moved or no longer exists.
        </p>
        <p style={{ color: "var(--fg-secondary)", margin: "0 0 28px" }}>
          Η σελίδα που ζητήσατε μετακινήθηκε ή δεν υπάρχει πλέον.
        </p>
        <div
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/" className="cta primary">
            Home
          </Link>
          <Link href="/el" className="cta outline">
            Αρχική
          </Link>
        </div>
      </div>
    </div>
  );
}
