import React from "react";
// import { Link } from "react-router-dom/cjs/react-router-dom";

import Navigation from "./Navigation";
import Login from "./Login";

import styles from "./Header.module.scss";

function Header() {
  return (
    <header className={styles.container}>
      <div data-wrapper>
        <img src="not-found.jpg" alt="Site Logo" />
        <Navigation />
        <Login />
      </div>
    </header>
  );
}

export default Header;
