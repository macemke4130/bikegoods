import { buildSchema } from "graphql";
import { query } from "./dbconnect.js";

import bcrypt from "bcrypt";
const saltRounds = 10;

export const schema = buildSchema(`
  type Query {
    greet: String
    userLogin (emailAddress: String!, userPassword: String!): AuthObject
    userInfo (id: Int!): User
    productDetails (id: Int!): Product
    paymentMethods (userId: Int!): PaymentMethod
    goodTypes: [GoodType]
    deliveryTypes: [DeliveryType]
    brands: [Brand]
    getBrand (id: Int!): Brand
    itemConditions: [ItemCondition]
  }

  type Mutation {
    newUser (displayName: String!, emailAddress: String!, userPassword: String!): mysqlResponse
    newGood (brand: Int, goodType: Int!, title: String!, quantity: Int, descriptionId: Int, price: Int, itemCondition: Int, deliveryId: Int): mysqlResponse
    newDescription (descriptionText: String): mysqlResponse
  }

  type AuthObject {
    success: Boolean
    emailAddress: String
    jwt: String
    message: String
    displayName: String
  }

  type mysqlResponse {
    fieldCount: Int
    afffieldCount: Int
    affectedRows: Int
    insertId: Int
    serverStatus: Int
    warningCount: Int
    message: String
    protocol41: Boolean
    changedRows: Int
}

type Product {
  id: Int
  sold: Boolean
  quantity: Int
  price: Int
  itemCondition: Int
  itemConditionName: String
  title: String
  brand: Int
  brandName: String
  descriptionId: Int
  descriptionText: String
  photosId: Int
  goodType: Int
  type: String
  deliveryType: String
}

type NewUser {
  email: String
  password: String
}

type DeliveryType {
  id: Int
  deliveryType: String
}

type ItemCondition {
  id: Int
  itemConditionName: String
}

type User {
  id: Int
  admin: Boolean
  emailAddress: String
  userPassword: String
  displayName: String
  firstName: String
  lastName: String
}

type PaymentMethod {
  id: Int
  userId: Int
  venmo: String
  paypal: String
  cashapp: String
  zelle: String
  applePay: String
  googlePa: String
}

type GoodType {
  id: Int
  type: String
}

type Brand {
  id: Int
  brandName: String
}

`);

export const root = {
  greet: () => {
    return "Satan";
  },
  userLogin: async (args, req) => {
    const r = await query("select * from users where emailAddress = ?", [args.emailAddress]);
    const passwordFromDB = r[0].userPassword;

    const passwordMatch = bcrypt.compareSync(args.userPassword, passwordFromDB);

    return {
      success: passwordMatch,
      emailAddress: args.emailAddress,
      displayName: passwordMatch ? r[0].displayName : "null",
      jwt: passwordMatch ? "JWT String" : "null",
      message: passwordMatch ? "200" : "Email or Password not recognized.",
    };
  },
  newUser: async (args, req) => {
    const hashedPassword = bcrypt.hashSync(args.userPassword, saltRounds);

    try {
      const newUserInfo = {
        displayName: args.displayName,
        emailAddress: args.emailAddress,
        userPassword: hashedPassword,
      };
      const r = await query("insert into users set ?", [newUserInfo]);
      return r;
    } catch (e) {
      const newUserInfo = {
        displayName: "error",
        emailAddress: "error",
        userPassword: "error",
        message: e.code,
      };
      console.log(e.code);
      return newUserInfo;
    }
  },
  newGood: async (args, req) => {
    // To Do: Check JWT before input - LM

    const r = await query("insert into goods set ?", [args]);
    return r;
  },
  newDescription: async (args, req) => {
    // To Do: Check JWT before input - LM

    const r = await query("insert into goodDescriptions set ?", [args]);
    return r;
  },
  productDetails: async (args, req) => {
    // const r = await query(`select * from goods where id = ?`, [args.id]);
    const r = await query(
      `select * from goods inner join brands on goods.brand = brands.id join goodTypes on goods.goodType = goodTypes.id join itemConditions on goods.itemCondition = itemConditions.id join goodDescriptions on goods.descriptionId = goodDescriptions.id join deliveryTypes on goods.deliveryId = deliveryTypes.id where goods.id = ?`,
      [args.id]
    );
    return r[0];
  },
  userInfo: async (args, req) => {
    const r = await query("select * from users where id = ?", [args.id]);
    return r[0];
  },
  paymentMethods: async (args, req) => {
    const r = await query("select * from paymentMethods where userId = ?", [args.userId]);
    return r[0];
  },
  goodTypes: async () => {
    const r = await query("select * from goodTypes order by id");
    return r;
  },
  deliveryTypes: async () => {
    const r = await query("select * from deliveryTypes order by id");
    return r;
  },
  brands: async () => {
    const r = await query("select * from brands order by id");
    return r;
  },
  getBrand: async (args, req) => {
    const r = await query("select * from brands where id = ?", [args.id]);
    return r[0];
  },
  itemConditions: async () => {
    const r = await query("select * from itemConditions order by id");
    return r;
  },
};

export default {
  schema,
  root,
};
