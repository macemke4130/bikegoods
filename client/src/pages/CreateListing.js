import React, { useReducer, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { gql } from "../utils/gql";

import styles from "./CreateListing.module.scss";

const config = {
  requiredState: ["title", "categoryId", "deliveryId", "quantity"],
  initialState: {
    brand: "",
    categoryId: 0,
    subcategoryId: 0,
    brandSelect: 0,
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
      const brandName = payload.dataValue.split("@")[1];

      return {
        ...state,
        brand: brandName,
        brandSelect: payload.dataValue,
        title: `${brandName} `,
      };
    }

    case "brand": {
      return {
        ...state,
        brand: payload.dataValue,
        title: `${payload.dataValue} `,
        brandSelect: 0,
      };
    }

    case "categoryId": {
      return {
        ...state,
        categoryId: dataValue,
      };
    }

    case "subcategoryId": {
      console.info(payload);
      return {
        ...state,
        subcategoryId: dataValue,
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

      const compareCategory = (a, b) => a.category > b.category;
      const compareBrand = (a, b) => a.brandName > b.brandName;

      // Make a copy of these databases before sorting.
      // This is important because I am referencing the original
      // order so populate the state.title for the user - LM
      config.databaseLists.categories = [...r.categories];
      config.databaseLists.brands = [r.brands];

      setServerOptions({
        deliveryTypes: r.deliveryTypes,
        brands: r.brands.sort(compareBrand),
        categories: r.categories.sort(compareCategory),
        itemConditions: r.itemConditions,
      });

      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const clickSubmitProduct = (e) => {
    e.preventDefault();

    if (validateInputs()) {
      if (!state.price) {
        setMessage(`Are you sure you want to list your ${state.title} for free?`);
        modalRef.current.showModal();
      }
      sendGoodToDB();
    } else {
      console.error("Keep Trying");
    }
  };

  const sendGoodToDB = async () => {
    const outsideTables = {
      description: 0,
    };

    // If descriptionText, insert into goodDescriptions database
    // and return insertId into {outsideTables}.
    if (state.descriptionText) {
      const descriptionStatus = await sendDescriptionToDB();
      outsideTables.description = descriptionStatus.insertId;
    }

    const productTitle = state.title.replaceAll("  ", " ");

    // Add product to goods table.
    try {
      const mutation = `mutation { newGood( 
        jwt: "${localStorage.getItem("jwt")}", 
        price: ${Number(state.price) * toPennies}, 
        itemCondition: ${Number(state.itemCondition)},  
        title: "${productTitle}",  
        brand: 1, 
        descriptionId: ${outsideTables.description ?? null}, 
        categoryId: ${Number(state.categoryId)}, 
        subcategoryId: ${Number(state.subcategoryId)} 
        quantity: ${Number(state.quantity)}, 
        deliveryId: ${Number(state.deliveryId)} )
      { insertId } }`;

      console.info(mutation);

      const r = await gql(mutation);

      const { newGood } = r;

      if (newGood.insertId) {
        console.info("Success");
        history.push(`/product-${newGood.insertId}?success=true`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendDescriptionToDB = async () => {
    try {
      const removeCarriageReturns = state.descriptionText.replace(RegExp(String.fromCharCode(10), "g"), "/n");
      const mutation = `mutation { newDescription(descriptionText: "${removeCarriageReturns}") { insertId} }`;
      const r = await gql(mutation);

      const { newDescription } = r;

      return { insertId: newDescription.insertId ?? 0 };
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

  const handleClearTitle = (e) => {
    e.preventDefault();
    const dataPoint = "title";
    const dataValue = "";
    dispatch({ dataPoint, dataValue });
  };

  if (loading === true) return <>Loading</>;

  return (
    <form className={styles.container}>
      <fieldset data-brand-box>
        <legend>Brand</legend>
        <label>
          <div data-brand-instructions>Select a Brand from list or type in the field</div>
          <div data-brand-inputs>
            <select data-point="brandSelect" value={state.brandSelect} onChange={handleReducer}>
              <option value="0">Brands...</option>
              {serverOptions?.brands?.map((brand) => (
                <option key={brand.brandName} data-brand-select={brand.brandName} value={`${brand.id}@${brand.brandName}`}>
                  {brand.brandName}
                </option>
              ))}
            </select>
            <input placeholder="Brand Name" data-point="brand" list="brand-list" value={state.brand} onChange={handleReducer} />
            <datalist id="brand-list">
              {serverOptions?.brands?.map((brand) => (
                <option key={brand.brandName} data-brand-id={brand.id} value={brand.brandName}></option>
              ))}
            </datalist>
          </div>
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
        <div>Characters Remaining: {state.descriptionCharacterCount} / 2000</div>
      </div>
      <button onClick={clickSubmitProduct} disabled={message ? true : false}>
        List Product
      </button>
      <dialog ref={modalRef}>
        <div>{message}</div>
        <button>List For Free</button>
        <button>No</button>
      </dialog>
    </form>
  );
}

export default CreateListing;
