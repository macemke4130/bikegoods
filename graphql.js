import { buildSchema } from "graphql";
import { query } from "./dbconnect.js";

import * as jsonwebtoken from "jsonwebtoken";
import config from "./config.js";
const privateKey = config.keys.jwt;

import bcrypt from "bcrypt";
const saltRounds = 10;

export const schema = buildSchema(`
  type Query {
    greet: String
    userLogin (emailAddress: String!, userPassword: String!): AuthObject
    userInfo (id: Int!): User
    authorizeJWT (jwt: String!): Boolean
    productDetails (id: Int!): Product
    paymentMethods (userId: Int!): PaymentMethod
    goodTypes: [GoodType]
    deliveryTypes: [DeliveryType]
    brands: [Brand]
    getBrand (id: Int!): Brand
    itemConditions: [ItemCondition]
    categories: [Category]
    subcategories (categoryId: Int!): [Subcategory]
  }

  type Mutation {
    newUser (displayName: String!, emailAddress: String!, userPassword: String!): mysqlResponse
    newGood (jwt: String!, brand: Int, title: String!, quantity: Int, descriptionId: Int, price: Int, itemCondition: Int, deliveryId: Int, categoryId: Int, subcategoryId: Int): mysqlResponse
    newDescription (descriptionText: String): mysqlResponse
  }

  type Category {
    id: Int
    category: String
  }

  type Subcategory {
    id: Int
    categoryId: Int
    subcategory: String
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
  dateListed: String
  userId: Int
  displayName: String
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
  category: String
  subcategory: String
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
  categories: async () => {
    const r = await query("select * from categories order by id");
    return r;
  },
  subcategories: async (args, req) => {
    const r = await query("select * from subcategories where categoryId = ? order by id", [args.categoryId]);
    return r;
  },
  userLogin: async (args, req) => {
    const r = await query("select * from users where emailAddress = ?", [args.emailAddress]);
    const passwordFromDB = r[0].userPassword;

    const passwordMatch = bcrypt.compareSync(args.userPassword, passwordFromDB);

    const userObject = {
      user: args.emailAddress,
      admin: r[0].admin,
      userId: r[0].id,
    };

    const token = passwordMatch ? await jsonwebtoken.default.sign({ data: userObject }, privateKey, { expiresIn: "365d" }) : null;

    const loginObject = {
      success: passwordMatch,
      emailAddress: args.emailAddress,
      displayName: passwordMatch ? r[0].displayName : "null",
      jwt: passwordMatch ? token : "null",
      message: passwordMatch ? "200" : "Email or Password not recognized.",
    };

    return loginObject;
  },
  authorizeJWT: async (args, req) => {
    const auth = await jsonwebtoken.default.verify(args.jwt, privateKey, function (err, decoded) {
      return err ? false : true;
    });
    return auth;
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

      return newUserInfo;
    }
  },
  newGood: async (args, req) => {
    const authUserId = await jsonwebtoken.default.verify(args.jwt, privateKey, function (err, decoded) {
      return decoded.data.userId;
    });

    delete args.jwt;
    args.userId = authUserId;
    console.log(args);

    const r = await query("insert into goods set ?", [args]);
    return r;
  },
  newDescription: async (args, req) => {
    const r = await query("insert into goodDescriptions set ?", [args]);
    return r;
  },
  productDetails: async (args, req) => {
    const r = await query(
      `select * from goods join users on goods.userId = users.id join brands on goods.brand = brands.id join categories on goods.categoryId = categories.id join subcategories on goods.subcategoryId = subcategories.id join itemConditions on goods.itemCondition = itemConditions.id join goodDescriptions on goods.descriptionId = goodDescriptions.id join deliveryTypes on goods.deliveryId = deliveryTypes.id where goods.id = ?`,
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
