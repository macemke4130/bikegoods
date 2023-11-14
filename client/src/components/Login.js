import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

import { gql } from "../utils/gql";
// import { waitForDOM } from "../utils/tools";

import styles from "./Login.module.scss";
import { waitForDOM } from "../utils/tools";

function Login() {
  const [loginWindowActive, setLoginWindowActive] = useState(false);
  const [logoutWindowActive, setLogoutWindowActive] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [userPassword, setUserPassword] = useState("");

  // Ref
  const emailInput = useRef();

  useEffect(() => {
    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  });

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && loginWindowActive) {
      e.preventDefault();
      validateLogin();
    }
  };

  const toggleLoginWindow = () => {
    if (displayName) {
      setLogoutWindowActive(true);
    } else {
      setLoginWindowActive(!loginWindowActive);
      waitForDOM(() => {
        if (!loginWindowActive) emailInput.current.focus();
      });
    }
  };

  const validateLogin = (e) => {
    if (e) e.preventDefault();

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

      if (!userLogin) {
        alertUser("danger", "Email or Password not recognized.");
        return;
      }

      if (userLogin.success) {
        setStorage(userLogin);
        setDisplayName(userLogin.displayName);
        setLoginWindowActive(false);
      } else {
        alertUser("danger", userLogin.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setStorage = (userLogin) => {
    localStorage.setItem("jwt", userLogin.jwt);
    localStorage.setItem("emailAddress", userLogin.emailAddress);
    localStorage.setItem("displayName", userLogin.displayName);
  };

  const clearStorage = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("emailAddress");
    localStorage.removeItem("displayName");
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
    clearStorage();
  };

  const closeWindow = (e) => {
    e.preventDefault();

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
        <form data-login-window>
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
        </form>
      )}
    </section>
  );
}

export default Login;
