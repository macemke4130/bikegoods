import React, { useRef, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { gql } from "../utils/gql";

import styles from "./ProductDetails.module.scss";

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

  console.info(state);
  return {
    ...payload,
    sold: soldStatus,
    price: `$${penniesToDollars}`,
  };
};

function ProductDetails() {
  // Ref
  const openGate = useRef(true);

  // Reducer
  const [state, dispatch] = useReducer(reducer, config.initialState);

  const productId = Number(useParams().id);

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

    getProductDetails();
  });

  const getProductDetails = async () => {
    try {
      const { productDetails } = await gql(
        `{ productDetails(id: ${productId}){ sold, quantity, price, itemCondition, itemConditionName, title, brandName, descriptionId, photosId, goodType, deliveryType } }`
      );

      dispatch(productDetails);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Product Details</h1>
      {Object.keys(state)?.map((thing) => (
        <div key={thing}>
          {thing}: {state[thing] + ""}
        </div>
      ))}
    </div>
  );
}

export default ProductDetails;
