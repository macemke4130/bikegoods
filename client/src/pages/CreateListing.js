import React, { useReducer, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { gql } from "../utils/gql";

import styles from "./CreateListing.module.scss";

const config = {
  requiredState: ["title", "goodType", "deliveryType", "quantity"],
  initialState: {
    brand: "",
    title: "",
    quantity: 1,
    price: 0.0,
    descriptionText: "",
    descriptionCharacterCount: 2000,
  },
  databaseLists: {
    goodTypes: [],
    brands: [],
  },
};

const toPennies = 100;

const validateDataPoint = (payload) => {
  const numberDataPoints = ["brand", "deliveryType", "goodType", "quantity", "price"];

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
    case "brand": {
      return {
        ...state,
        brand: payload.dataValue,
        title: `${payload.dataValue} `,
      };
    }

    case "goodType": {
      return {
        ...state,
        goodType: dataValue,
        title: `${state.title} ${config.databaseLists.goodTypes[dataValue - 1].type}`,
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
        goodTypes { id, type }
        deliveryTypes { id, type }
        brands { id, brandName }
        itemConditions { id, itemConditionName }
        }`);

      console.info({ r });

      const compareType = (a, b) => a.type > b.type;
      const compareBrand = (a, b) => a.brandName > b.brandName;

      // Make a copy of the goodTypes database before sorting
      config.databaseLists.goodTypes = [...r.goodTypes];
      config.databaseLists.brands = [r.brands];

      setServerOptions({
        deliveryTypes: r.deliveryTypes,
        brands: r.brands.sort(compareBrand),
        goodTypes: r.goodTypes.sort(compareType),
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

    // Add product to goods table.
    try {
      const r = await gql(
        `mutation { newGood( price: ${Number(state.price) * toPennies}, itemCondition: ${Number(state.itemCondition)},  title: "${
          state.title
        }",  brand: 1, descriptionId: ${outsideTables.description ?? null}, goodType: ${Number(state.goodType)}, quantity: ${Number(
          state.quantity
        )}, deliveryType: ${Number(state.deliveryType)} ){ insertId } }`
      );

      const { newGood } = r;

      if (newGood.insertId) {
        history.push(`/product-${newGood.insertId}?success=true`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendDescriptionToDB = async () => {
    try {
      const r = await gql(`mutation { newDescription(descriptionText: "${state.descriptionText}") { insertId} }`);
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
      <label>
        Brand:
        <input data-point="brand" list="brand-list" value={state.brand} onChange={handleReducer} />
        <datalist id="brand-list">
          {serverOptions?.brands?.map((brand) => (
            <option key={brand.brandName} data-brand-id={brand.id} value={brand.brandName}></option>
          ))}
        </datalist>
      </label>

      <label>
        Type of product:
        <select data-point="goodType" value={state.goodType} onChange={handleReducer}>
          <option value="0">Please Select...</option>
          {serverOptions?.goodTypes?.map((type) => (
            <option key={type.type} value={type.id}>
              {type.type}
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
        <select data-point="deliveryType" value={state.deliveryType} onChange={handleReducer}>
          <option value="0">Please Select...</option>
          {serverOptions?.deliveryTypes?.map((type) => (
            <option key={type.type} value={type.id}>
              {type.type === "pickup" && "Pickup Only"}
              {type.type === "shipping" && "Shipping Only"}
              {type.type === "both" && "Pickup or Shipping"}
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
