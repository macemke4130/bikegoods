import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom/cjs/react-router-dom";

import styles from "./Footer.module.scss";

function Footer() {
  const [thisYear, setThisyear] = useState(0);

  useEffect(() => {
    if (thisYear) return;
    displayYear();
  });

  const displayYear = () => {
    const rightNow = new Date(Date.now());
    setThisyear(rightNow.getFullYear());
  };

  return (
    <footer className={styles.container}>
      <div data-copyright>Copyright {thisYear}</div>
    </footer>
  );
}

export default Footer;
