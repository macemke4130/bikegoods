import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./GlobalStyles.scss";

// Pages
import CreateListing from "./pages/CreateListing";
import ProductDetails from "./pages/ProductDetails";

// Components
import Header from "./components/Header";

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
            <Route path="/create-listing">
              <h1>List your item!</h1>
              <CreateListing />
            </Route>
            <Route path="/product-:id">
              <ProductDetails />
            </Route>
          </Switch>
        </main>
      </Router>
      <div id="footer-spacer" aria-hidden="true" />
      <footer>Some Copyright Information</footer>
    </>
  );
}

export default App;
