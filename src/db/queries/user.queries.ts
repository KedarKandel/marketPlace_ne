import type { UUID } from "crypto";
import { db } from "../db.ts";
import { usersTable } from "../schemas/users.ts";
import { eq } from "drizzle-orm";

export type UserType = typeof usersTable.$inferSelect;
export type NewUserType = typeof usersTable.$inferInsert;

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

export const getUserByUserEmail = async (
  userEmail: string
): Promise<UserType> => {
  const [foundUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  if (!foundUser) {
    throw new Error("User not found");
  }
  return foundUser;
};
