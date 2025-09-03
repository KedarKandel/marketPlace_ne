
import { sql } from "drizzle-orm";

import {
  check,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";


export type UserRole = "admin" | "user" | "farmer";

export const usersTable = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    role: varchar({ length: 10 }).notNull().default("user").$type<UserRole>(),
    createdAt: timestamp({ withTimezone: true }).defaultNow(),
    updateddAt: timestamp({ withTimezone: true }).defaultNow(),
    age: integer(),

  },
  (table) => [
    check("age_check1", sql`${table.age} <= 120`),
    check("age_check2", sql`${table.age} >= 0`),
  ]
);

