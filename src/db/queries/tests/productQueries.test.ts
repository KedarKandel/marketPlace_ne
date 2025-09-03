import { beforeEach, afterEach, describe, it, expect, mock } from "bun:test";

import {
  insertProduct,
  getProdctsByUserId,
  type NewProductType,
} from "../product.queries.ts";
import {
  createTestDb,
  destroyTestDb,
  type TestDbContext,
} from "../../../tests/setup-test-db.ts";
import { insertUser, type NewUserType } from "../user.queries.ts";
import type { UUID } from "crypto";

export let ctx: TestDbContext;

beforeEach(async () => {
  ctx = await createTestDb();
  await mock.module("../../db/db.ts", () => ({
    db: ctx.db,
  }));
});

afterEach(async () => {
  await destroyTestDb(ctx);
});


describe("InsertProduct", async () => {
  // user to be inserted
  const newUser: NewUserType = {
    name: "Kedar Kandel",
    email: `kedar${Date.now()}@kedar.com`,
    password: "Password123",
  };
  // insert user and extract userId
  const user = await insertUser(newUser);
  const newProduct: NewProductType = {
    userId: user.id,
    title: "Kalapani fal",
    description: "This is the especiality of Kalapani, Nepal",
  };
  it("Should insert a product into the database", async () => {
    const product = await insertProduct(newProduct);
    expect(product?.id).toBeDefined();
    expect(product?.userId).toBe(newProduct.userId);
  });
});

// get all by user_id test
describe("getAllProductsByUserId", () => {
  // user to be inserted
  const newUser: NewUserType = {
    name: "Kedar Kandel",
    email: `kedar${Date.now()}@kedar.com`,
    password: "Password123",
  };
  it("should return all product associated with the given user_id", async () => {
    const user = await insertUser(newUser);
    const userId = user.id;

    const newProduct1: NewProductType = {
      userId: user.id,
      title: "apple-1",
      description: "This is apple 1 desc",
    };
    const newProduct2: NewProductType = {
      userId: user.id,
      title: "apple-2",
      description: "This is apple 2 desc",
    };

    await insertProduct(newProduct1);
    await insertProduct(newProduct2);
    const products = await getProdctsByUserId(userId as UUID);
    expect(products.length).toBe(2);
  });
});
