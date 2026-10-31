"use client";

/**
 * Last resort when even the root layout fails, so it can't use the dictionaries or the design system:
 * it carries its own two-language message and plain styles.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "4rem 1rem", background: "#faf6f1", color: "#141414" }}>
        <h1 style={{ color: "#561f5a" }}>حصلت مشكلة عندنا · Something went wrong</h1>
        <p>جربي تاني بعد شوية. · Please try again in a moment.</p>
        {error.digest && <p dir="ltr" style={{ fontSize: "0.8rem", color: "#5c5560" }}>{error.digest}</p>}
        <button
          onClick={reset}
          style={{ marginTop: "1rem", padding: "0.75rem 2rem", border: 0, borderRadius: "999px", background: "#832f88", color: "#fff", fontSize: "1rem", cursor: "pointer" }}
        >
          جربي تاني · Retry
        </button>
      </body>
    </html>
  );
}
