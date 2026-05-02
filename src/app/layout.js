import "../styles/reset.css";
import "../styles/variables.css";
import "../styles/global.css";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>
          <div className="section">
            <div className="container">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}