'use client';

import styles from "./navbar.module.css";
import Link from "next/link";

const Navbar = () => {

  return (
    <nav className={`${styles.navbar} section`}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
                <li>
          <Link href="/add-profile">Add Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;