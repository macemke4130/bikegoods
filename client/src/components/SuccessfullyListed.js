import React, { useState } from "react";

import styles from "./SuccessfullyListed.module.scss";

function SuccessfullyListed({ listSuccess }) {
  const [active, setActive] = useState(listSuccess);

  const closeAlert = () => {
    setActive(false);
  };

  if (active) {
    return (
      <aside aria-label="Listing Success Message" className={styles.container}>
        <button onClick={closeAlert}>X</button>
        Item has been successfully listed!
      </aside>
    );
  } else {
    return <></>;
  }
}

export default SuccessfullyListed;
