import React from "react";
import { useEffect, useState } from "react";

import { gql } from "./utils/gql";

function App() {
  const [openGate, setOpenGate] = useState(true);
  const [greeting, setGreeting] = useState("World");

  const getGreeting = async () => {
    setOpenGate(false);

    try {
      const r = await gql(`{userInfo(id:1) {displayName}}`);
      console.info(r);
      setGreeting(r.userInfo.displayName);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (openGate) getGreeting();
  });

  return <>Hello there {greeting}. Your React and GraphQL App is running!</>;
}

export default App;
