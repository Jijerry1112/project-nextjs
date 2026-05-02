import "../styles/reset.css";
import "../styles/variables.css";
import "../styles/global.css";

import Navbar from "../components/Navbar";
import SessionProvider from "../components/SessionProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}