import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { gql } from "../utils/gql";

const PrivateRoute = ({ children, ...rest }) => {
  const [validLogin, setValidLogin] = useState(true);

  useEffect(() => {
    authorizeJWT();
  });

  const authorizeJWT = async () => {
    console.info("Authorizing Login");
    const localJWT = localStorage.getItem("jwt");

    const { authorizeJWT } = await gql(`{authorizeJWT (jwt: "${localJWT}")}`);
    setValidLogin(authorizeJWT);
  };

  if (validLogin) {
    return <Route {...rest}>{children}</Route>;
  } else {
    return <Redirect to="/" />;
  }
};

export default PrivateRoute;
