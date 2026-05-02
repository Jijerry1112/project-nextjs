"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>Something went wrong</h1>

      <p>An unexpected error occurred.</p>

      <button
        onClick={() => reset()}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </main>
  );
}