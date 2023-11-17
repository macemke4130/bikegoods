import React, { useReducer, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { gql } from "../utils/gql";

import styles from "./CreateListing.module.scss";

const config = {
  requiredState: ["title", "categoryId", "deliveryId", "quantity"],
  initialState: {
    brandId: 0,
    brandInput: "",
    brandSelect: "",
    categoryId: 0,
    subcategoryId: 0,
    title: "",
    quantity: 1,
    price: 0.0,
    descriptionText: "",
    descriptionCharacterCount: 2000,
  },
  databaseLists: {
    categories: [],
    subcategories: [],
    brands: [],
  },
};

const toPennies = 100;

const validateDataPoint = (payload) => {
  const numberDataPoints = ["brand", "deliveryId", "category", "quantity", "price"];

  numberDataPoints.forEach((numberedDataPoint) => {
    if (numberedDataPoint === payload.dataPoint) return Number(payload.dataPoint);
  });

  return payload.dataValue;
};

const reducer = (state, payload) => {
  const dataValue = validateDataPoint(payload);

  // Prevent user from selecting a "0" option.
  if (dataValue === 0) return { ...state };

  switch (payload.dataPoint) {
    case "brandSelect": {
      const brandSplit = payload.dataValue.split("@");
      const brandId = Number(brandSplit[0]);
      const brandName = brandSplit[1];

      return {
        ...state,
        brandId: brandId,
        brandSelect: payload.dataValue,
        brandInput: brandName,
        title: `${brandName} `,
      };
    }

    case "brandInput": {
      return {
        ...state,
        brandId: 0,
        brandSelect: 0,
        brandInput: payload.dataValue,
        title: `${payload.dataValue} `,
      };
    }

    case "descriptionText": {
      const remainingCharacters = config.initialState.descriptionCharacterCount - dataValue.length;

      if (remainingCharacters <= -1) {
        return { ...state };
      } else {
        return {
          ...state,
          descriptionText: dataValue,
          descriptionCharacterCount: remainingCharacters,
        };
      }
    }

    default: {
      return {
        ...state,
        [payload.dataPoint]: dataValue,
      };
    }
  }
};

function CreateListing() {
  // Ref
  const openGate = useRef(true);
  const modalRef = useRef(null);

  // State
  const [loading, setLoading] = useState(true);
  const [serverOptions, setServerOptions] = useState({});
  const [message, setMessage] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  // Reducer
  const [state, dispatch] = useReducer(reducer, config.initialState);

  const history = useHistory();

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;
    getServerOptions();
  });

  const getServerOptions = async () => {
    try {
      const r = await gql(`{ 
        categories { id, category }
        deliveryTypes { id, deliveryType }
        brands { id, brandName }
        itemConditions { id, itemConditionName }
        }`);

      setServerOptions({
        deliveryTypes: r.deliveryTypes,
        brands: r.brands,
        categories: r.categories,
        itemConditions: r.itemConditions,
      });

      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReducer = (e) => {
    const dataPoint = e.target.dataset.point;
    const dataValue = e.target.value;

    dispatch({ dataPoint, dataValue });
    if (dataPoint === "categoryId") fetchSubcategory(dataValue);
  };

  const fetchSubcategory = async (categoryId) => {
    const { subcategories } = await gql(`{ subcategories (categoryId: ${Number(categoryId)}) { id, subcategory } }`);
    subcategories.sort((a, b) => a.subcategory > b.subcategory);
    setSubcategories(subcategories);
  };

  const checkBrand = async () => {
    if (state.brandSelect) {
      sendGoodToDB({ brandId: state.brandSelect });
      return;
    }

    const brandIdExists = config.databaseLists.brands.findIndex((element) => element.brandName === state.brandInput);
    console.info(config.databaseLists.brands);

    if (brandIdExists !== -1) {
      sendGoodToDB({ brandId: brandIdExists });
    } else {
      // Send new brand to DB, then send the rest of the good to DB
      sendNewBrand(state.brandInput);
    }
  };

  // Insert new brand, send returned id to sendGoodToDB().
  const sendNewBrand = async (newBrandFromInput) => {
    try {
      const { newBrand } = await gql(`mutation { newBrand (brandName: "${newBrandFromInput}") { insertId } }`);

      if (newBrand) {
        sendGoodToDB({ brandId: newBrand.insertId });
      } else {
        console.info("Duplicate");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendGoodToDB = async (brandPayload) => {
    const productTitle = state.title.replaceAll("  ", " ");

    // Add product to goods table.
    try {
      const mutation = `mutation { newGood( 
        jwt: "${localStorage.getItem("jwt")}", 
        price: ${Number(state.price) * toPennies}, 
        itemCondition: ${Number(state.itemCondition)},  
        title: "${productTitle}",  
        brand: ${state.brandId || brandPayload.brandSelect || brandPayload.brandId}, 
        descriptionText: "${state.descriptionText ?? null}",
        categoryId: ${Number(state.categoryId)}, 
        subcategoryId: ${Number(state.subcategoryId)} 
        quantity: ${Number(state.quantity)}, 
        deliveryId: ${Number(state.deliveryId)} )
      { insertId } }`;
      console.info(mutation);

      const { newGood } = await gql(mutation);

      if (newGood.insertId) {
        console.info("Success");
        history.push(`/product-${newGood.insertId}?success=true`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const validateInputs = () => {
    let validGood = true;
    const invalidInputs = [];

    config.requiredState.forEach((dataPoint) => {
      if (!state[dataPoint]) {
        invalidInputs.push(dataPoint);
        validGood = false;
      }
    });

    if (!validGood) {
      console.error(invalidInputs);
    }

    return validGood;
  };

  const handleClearTitle = (e) => {
    e.preventDefault();
    const dataPoint = "title";
    const dataValue = "";
    dispatch({ dataPoint, dataValue });
  };

  const clickSubmitProduct = (e) => {
    e.preventDefault();

    validateInputs() ? checkBrand() : console.error("More Inputs");
  };

  if (loading === true) return <>Loading</>;

  return (
    <>
      <form className={styles.container}>
        <fieldset data-brand-box>
          <legend>Brand</legend>
          <label>
            <span data-brand-instructions>Select a Brand from list or type in the field</span>
            <span data-brand-inputs>
              <select data-point="brandSelect" value={state.brandSelect} onChange={handleReducer}>
                <option value="0">Brands...</option>
                {serverOptions?.brands?.map((brand) => (
                  <option key={brand.brandName} data-brand-select={brand.brandName} value={`${brand.id}@${brand.brandName}`}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
              <input placeholder="Brand Name" data-point="brandInput" list="brand-list" value={state.brandInput} onChange={handleReducer} />
              <datalist id="brand-list">
                {serverOptions?.brands?.map((brandOption) => (
                  <option key={brandOption.brandName} data-brand-id={brandOption.id} value={brandOption.brandName}></option>
                ))}
              </datalist>
            </span>
          </label>
        </fieldset>

        <label>
          Product Category:
          <select data-point="categoryId" value={state.categoryId} onChange={handleReducer}>
            <option value="0">Please Select...</option>
            {serverOptions?.categories?.map((category) => (
              <option key={category.category} value={category.id}>
                {category.category}
              </option>
            ))}
          </select>
        </label>

        <label data-visually-hidden={subcategories.length ? false : true}>
          Sub-Category:
          <select data-point="subcategoryId" value={state.subcategoryId} onChange={handleReducer}>
            <option value="0">Please Select...</option>
            {subcategories?.map((subcategory) => (
              <option key={subcategory.subcategory} value={subcategory.id}>
                {subcategory.subcategory}
              </option>
            ))}
          </select>
        </label>

        <label>
          Product Title:
          <input type="text" data-point="title" value={state.title} onChange={handleReducer}></input>
          <button onClick={handleClearTitle} aria-label="Erase Title Text">
            X
          </button>
        </label>

        <label>
          Quantity:
          <input type="number" step="1" inputMode="numeric" data-point="quantity" value={state.quantity} onChange={handleReducer}></input>
        </label>

        <label>
          Item Condition:
          <select data-point="itemCondition" value={state.itemCondition} onChange={handleReducer}>
            <option value="0">Please Select...</option>
            {serverOptions?.itemConditions?.map((condition) => (
              <option key={condition.itemConditionName} value={condition.id}>
                {condition.itemConditionName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Price in USD:
          <input type="number" step="1" inputMode="numeric" data-point="price" value={state.price} onChange={handleReducer} />
        </label>

        <label>
          Delivery Method:
          <select data-point="deliveryId" value={state.deliveryId} onChange={handleReducer}>
            <option value="0">Please Select...</option>
            {serverOptions?.deliveryTypes?.map((type) => (
              <option key={type.deliveryType} value={type.id}>
                {type.deliveryType}
              </option>
            ))}
          </select>
        </label>

        <div>
          <label>
            Product Description
            <textarea data-point="descriptionText" value={state.descriptionText} onChange={handleReducer} />
          </label>
          <span>Characters Remaining: {state.descriptionCharacterCount} / 2000</span>
        </div>

        <button onClick={clickSubmitProduct} disabled={message ? true : false}>
          List Product
        </button>
      </form>

      <dialog ref={modalRef}>
        <div>{message}</div>
        <button>List For Free</button>
        <button>No</button>
      </dialog>
    </>
  );
}

export default CreateListing;
