import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./GlobalStyles.scss";

// Pages
import CreateListing from "./pages/CreateListing";
import ProductDetails from "./pages/ProductDetails";

// Components
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Router>
        <Header />
        <main id="main-content">
          <Switch>
            <Route exact path="/">
              <h1>The Home Page!</h1>
            </Route>
            <PrivateRoute path="/create-listing">
              <h1>List your item!</h1>
              <CreateListing />
            </PrivateRoute>
            <Route path="/product-:id">
              <ProductDetails />
            </Route>
          </Switch>
        </main>
      </Router>
      <div id="footer-spacer" aria-hidden="true" />
      <Footer />
    </>
  );
}

export default App;
