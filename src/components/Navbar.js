"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "./navbar.module.css";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/add-profile">Add Profile</Link>
      </div>

      <div className={styles.authSection}>
        {status === "loading" ? (
          <span className={styles.userEmail}>Loading...</span>
        ) : session?.user ? (
          <>
            <span className={styles.userEmail}>{session.user.email}</span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className={styles.signOutBtn}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className={styles.signInLink}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}