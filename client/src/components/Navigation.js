import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

import styles from "./Navigation.module.scss";

function Navigation() {
  return (
    <nav className={styles.container}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/create-listing">Create Listing</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
