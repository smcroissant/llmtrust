"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, sans-serif",
            background: "#0a0a0a",
            color: "#fafafa",
            padding: "2rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Something went wrong
          </h1>
          <p
            style={{
              color: "#a1a1aa",
              marginBottom: "2rem",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Try again
          </button>
          {process.env.NODE_ENV === "development" && (
            <pre
              style={{
                marginTop: "2rem",
                padding: "1rem",
                background: "#18181b",
                borderRadius: "8px",
                maxWidth: "600px",
                overflow: "auto",
                fontSize: "0.85rem",
                color: "#f87171",
              }}
            >
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          )}
        </div>
      </body>
    </html>
  );
}
