import React, { useRef, useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useParams } from "react-router-dom";
import { gql } from "../utils/gql";

import styles from "./ProductDetails.module.scss";

// Components
import Loading from "../components/Loading";
import SuccessfullyListed from "../components/SuccessfullyListed";

const config = {
  initialState: {
    sold: false,
    quantity: 0,
    price: 0,
    itemCondition: 0,
    title: "",
    brand: 0,
    descriptionId: 0,
    photosId: null,
    goodType: 0,
    deliveryType: 0,
  },
};

const reducer = (state, payload) => {
  const penniesToDollars = payload.price / 100;
  const soldStatus = payload.sold ? "No Longer Available" : "Still Available";
  const descriptionParagraphs = payload.descriptionText.split("/n");

  console.info(descriptionParagraphs);

  return {
    ...payload,
    sold: soldStatus,
    price: `$${penniesToDollars}`,
    descriptionParagraphs,
  };
};

function ProductDetails() {
  // Ref
  const openGate = useRef(true);

  // State
  const [loading, setLoading] = useState(true);
  const [listSuccess, setListSuccess] = useState(true);

  // Reducer
  const [state, dispatch] = useReducer(reducer, config.initialState);

  const productId = Number(useParams().id);

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

    getProductDetails();
    checkSuccess();
  });

  const checkSuccess = () => setListSuccess(window.location.search.split("success=")[1] === "true");

  const getProductDetails = async () => {
    try {
      const { productDetails } = await gql(
        `{ productDetails(id: ${productId}){ sold, quantity, price, itemConditionName, title, brandName, descriptionId, photosId, goodType, type, deliveryType, descriptionText } }`
      );

      if (productDetails) {
        console.info(productDetails);
        dispatch(productDetails);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <SuccessfullyListed listSuccess={listSuccess} />
      <Link to="#">See All {state.type}</Link>
      <div data-pdp-column>
        <section data-image-section aria-label="Product Photo" data-image>
          <img data-image src="./not-found.png" alt="Missing." />
        </section>
        <section data-details-section aria-label="Product Details">
          <h1>{state.title}</h1>
          <div data-price>{state.price}</div>
          <div data-status>Listing Status: {state.sold}</div>
          <div data-quantity>Quantity Available: {state.quantity}</div>
          <div data-condition>Item Condition: {state.itemConditionName}</div>
          {/* {Object.keys(state)?.map((thing) => (
            <div key={thing}>
              {thing}: {state[thing] + ""}
            </div>
          ))} */}
        </section>
      </div>
      <section data-description aria-labelledby="description-title">
        <h2 id="description-title">Product Description</h2>
        {state.descriptionParagraphs.map((p, index) => (
          <p key={`p-${index}`}>{p}</p>
        ))}
      </section>
    </div>
  );
}

export default ProductDetails;
