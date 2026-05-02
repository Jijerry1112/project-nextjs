export default function Loading() {
  return (
    <main
      style={{
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h2>Loading profiles...</h2>

      <div
        style={{
          marginTop: "20px",
          fontSize: "18px",
          opacity: 0.7,
        }}
      >
        Fetching data from server...
      </div>
    </main>
  );
}