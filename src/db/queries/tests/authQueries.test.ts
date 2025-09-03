import {
  describe,
  it,
  expect,
  beforeEach,
  mock,
  afterEach,
  beforeAll,
} from "bun:test";
import {
  authenticateUser,
  insertUser,
  type NewUserType,
  type UserType,
} from "../auth.queries.ts";
import {
  createTestDb,
  destroyTestDb,
  type TestDbContext,
} from "../../../tests/setup-test-db.ts";

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

//1.
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

//2.
describe("authenticateUser", () => {
  let createdUser: Omit<UserType, "password">;
  const plainPassword = "Password123";

  beforeAll(async () => {
    // Insert a fresh user only once for all tests
    createdUser = await insertUser({
      name: "Kedar Kandel",
      email: `kedar${Date.now()}@kedar.com`, // unique email
      password: plainPassword,
    });
  });
  it("Should authenticate user", async () => {
    const loggedInUser = await authenticateUser(
      createdUser.email,
      plainPassword
    );
    expect(loggedInUser?.id).toBeDefined();
    expect(loggedInUser?.email).toBeDefined();
  });
  it("Should throw error if password is invalid", async () => {
    expect(
      authenticateUser(createdUser.email, "wrongPassword")
    ).rejects.toThrow("Invalid credentials");
  });

  it("Should throw error if user does not exist", async () => {
    expect(authenticateUser("not@found.com", "Password123")).rejects.toThrow(
      "User not found"
    );
  });
  it("Should not return password field", async () => {
    const loggedInUser = await authenticateUser(
      createdUser.email,
      plainPassword
    );
    expect((loggedInUser as any).password).toBeUndefined();
  });
});
