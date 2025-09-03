
import { describe, it, expect, beforeEach, mock, afterEach } from "bun:test";
import { insertUser, type NewUserType } from "../user.queries.ts";
import { createTestDb, destroyTestDb, type TestDbContext } from "../../../tests/setup-test-db.ts";

let ctx: TestDbContext;

beforeEach(async () => {
  ctx = await createTestDb();
  await mock.module("../../db/db.ts", () => ({
    db: ctx.db,
  }));
});

afterEach(async () => {
  await destroyTestDb(ctx);
});

describe("insertUser", () => {
  const newUser: NewUserType = {
    name: "Kedar kandel",
    email: `kedar${Date.now()}@kedar.com`,
    password: "Password123",
  };
  it("Should insert an user to the database", async () => {
    const user = await insertUser(newUser);
    expect(user?.id).toBeDefined();
    expect(user?.email).toBeDefined();
  });
});
