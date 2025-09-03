
import { eq } from "drizzle-orm";
import { db } from "../db.ts";
import { usersTable } from "../schemas/users.ts";


export type UserType = typeof usersTable.$inferSelect;
export type NewUserType = typeof usersTable.$inferInsert;


// insert new user into databse
export const insertUser = async (
  user: NewUserType
): Promise<Omit<UserType, "password">> => {
  const hashedPassword = await Bun.password.hash(user.password);
  const [createdUser] = await db
    .insert(usersTable)
    .values({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    })
    .returning();

  if (!createdUser) {
    throw new Error("Failed to create user");
  }

  const { password, ...safeUser } = createdUser;

  return safeUser;
};

// authenticate user before login
export const authenticateUser = async (
  reqEmail: string,
  reqPassword: string
): Promise<Omit<UserType, "password">> => {
  const [foundUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, reqEmail));

  if (!foundUser) {
    throw new Error("User not found");
  }

  const isPasswordValid = await Bun.password.verify(reqPassword, foundUser.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  const { password, ...safeUser } = foundUser;
  return safeUser;
};
