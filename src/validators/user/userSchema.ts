import { createInsertSchema } from "drizzle-zod";
import { usersTable } from "../../db/schemas/schema";
import { z } from "zod";

// Base schema for inserting users
export const insertUserSchema = createInsertSchema(usersTable, {
  name: () =>
    z
      .string({ error: "Name is required" })
      .min(4, "Name should be at least 4 characters")
      .max(50, "Name is too long")
      .refine((val) => !!val, { message: "Name is required" }),

  email: () => z.email({ error: "Email is required" }),

  password: () =>
    z
      .string({ error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(255, "Password too long"),

  role: () => z.enum(["admin", "user", "farmer"]).default("user"),

  age: () =>
    z
      .number()
      .optional()
      .refine((val) => val === undefined || (val >= 0 && val <= 120), {
        message: "Age must be between 0 and 120",
      }),
});

// Register schema → allow all fields except id/createdAt
export const registerSchema = insertUserSchema.pick({
  name: true,
  email: true,
  password: true,
  role: true,
  age: true,
});

// Login schema → only email + password
export const loginSchema = z.object({
  email: insertUserSchema.shape.email,
  password: insertUserSchema.shape.password,
});

// Types for convenience
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
