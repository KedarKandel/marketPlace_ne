import { reset, seed } from "drizzle-seed";
import * as schema from "../src/db/schemas/schema.ts";
import type { UserRole } from "../src/db/schemas/users.ts";
import { db, pool } from "../src/db/db.ts";

const roles: UserRole[] = ["user", "admin", "farmer"];
const names = [
  "ram",
  "shyam",
  "hari",
  "deepak",
  "rahul",
  "Binod",
  "Sapana",
  "Bipana",
];

const productTitles = [
  "apple",
  "Tomato",
  "mango",
  "Pineapple",
  "carrot",
  "Raddish",
  "Papaya",
  "Cucumber",
];

const ProductDescription = [
  "This is tasty",
  "This is healthy",
  "This is cheap",
  "This is the most popular one out there",
  "This is a little sour",
  "This is grown in my house",
  "This is insecticides free yield",
];

export const seedDb = async () => {
  await reset(db, schema);
  await seed(db, schema).refine((funcs) => ({
    usersTable: {
      columns: {
        name: funcs.valuesFromArray({ values: names }),
        role: funcs.valuesFromArray({ values: roles }),
        age: funcs.int({ maxValue: 120, minValue: 0 }),
      },
      count: 10,
      with: {
        productsTable: 10,
      },
    },
    productsTable: {
      columns: {
        title: funcs.valuesFromArray({
          values: productTitles,
        }),
        description: funcs.valuesFromArray({
          values: ProductDescription,
        }),
      },
    },
  }));
};

seedDb()
  .then(() => {
    console.log("database was seeded successfully");
    return pool.end();
  })
  .catch((error) => {
    console.log(error);
    return pool.end();
  });
