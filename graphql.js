import { buildSchema } from "graphql";
import { query } from "./dbconnect.js";

export const schema = buildSchema(`
  type Query {
    greet: String
    userInfo (id: Int!): User
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

type User {
  id: Int
  admin: Boolean
  emailAddress: String
  userPassword: String
  displayName: String
  firstName: String
  lastName: String
}

`);

export const root = {
  greet: () => {
    return "Satan";
  },
  userInfo: async (args, req) => {
    const r = await query("select * from users where id = ?", [args.id]);
    return r[0];
  },
};

export default {
  schema,
  root,
};
