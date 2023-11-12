import React, { useState, useRef } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

import { gql } from "../utils/gql";

import styles from "./Login.module.scss";

function Login() {
  const [loginWindowActive, setLoginWindowActive] = useState(false);
  const [logoutWindowActive, setLogoutWindowActive] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [emailAddress, setEmailAddress] = useState("lucasmace4130@gmail.com");
  const [userPassword, setUserPassword] = useState("");

  // Ref
  const emailInput = useRef();

  const toggleLoginWindow = () => {
    if (displayName) {
      setLogoutWindowActive(true);
    } else {
      setLoginWindowActive(!loginWindowActive);
      setTimeout(() => (!loginWindowActive ? emailInput.current.focus() : null), 1);
    }
  };

  const validateLogin = () => {
    if (!emailAddress || !userPassword) {
      alertUser("danger", "Both Fields are Required");
    } else {
      attemptLogin();
    }
  };

  const attemptLogin = async () => {
    try {
      const { userLogin } = await gql(`{userLogin (emailAddress: "${emailAddress}", userPassword: "${userPassword}")
      {success, emailAddress, displayName, jwt, message}}`);

      if (userLogin.success) {
        setDisplayName(userLogin.displayName);
        setLoginWindowActive(false);
      } else {
        alertUser("danger", userLogin.message);
      }
      console.info(userLogin);
    } catch (e) {
      console.error(e);
    }
  };

  const alertUser = (alertType, message) => {
    alert(message);
  };

  const handleLoginChange = (e) => {
    if (e.target.id === "emailAddress") {
      setEmailAddress(e.target.value);
    }
    if (e.target.id === "userPassword") {
      setUserPassword(e.target.value);
    }
  };

  const logoutUser = () => {
    setDisplayName("");
    setLogoutWindowActive(false);
  };

  const closeWindow = () => {
    setLoginWindowActive(false);
    setLogoutWindowActive(false);
  };

  return (
    <section aria-label="Log In" className={styles.container}>
      <button onClick={toggleLoginWindow} aria-label="Account Info Popup">
        {displayName ? displayName : "Login"}
      </button>
      {logoutWindowActive && (
        <div data-logout-window>
          <button data-window-button aria-label="Close Window" onClick={closeWindow}>
            X
          </button>
          <Link to="/profile">My Profile</Link>
          <Link to="/listings">My Listings</Link>
          <Link to="/messages">Messages</Link>
          <button onClick={logoutUser}>Logout</button>
        </div>
      )}
      {loginWindowActive && (
        <div data-login-window>
          <button data-window-button aria-label="Close Window" onClick={closeWindow}>
            X
          </button>
          <div data-login-title>Log In</div>
          <label>
            Email:
            <input ref={emailInput} id="emailAddress" type="email" value={emailAddress} onChange={handleLoginChange} />
          </label>
          <label>
            Password:
            <input id="userPassword" type="password" value={userPassword} onChange={handleLoginChange} />
          </label>
          <button onClick={validateLogin}>Submit</button>
        </div>
      )}
    </section>
  );
}

export default Login;
