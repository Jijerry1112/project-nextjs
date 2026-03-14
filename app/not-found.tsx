import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "48px" }}>404</h1>

      <h2>Page Not Found</h2>

      <p>The page you are looking for does not exist.</p>

      <Link
        href="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          background: "#0070f3",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        Go back Home
      </Link>
    </main>
  );
}