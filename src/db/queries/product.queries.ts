import type { UUID } from "crypto";
import { db } from "../db.ts";
import { productsTable } from "../schemas/products.ts";
import { desc, eq } from "drizzle-orm";

// $inferSelect → use for queries (all fields returned from DB).
export type ProductType = typeof productsTable.$inferSelect;

// $inferInsert → use for inserts (optional DB-generated fields).
export type NewProductType = typeof productsTable.$inferInsert;

// insert product

export const insertProduct = async (
  product: NewProductType
): Promise<ProductType | undefined> => {
  const [createdProduct] = await db
    .insert(productsTable)
    .values(product)
    .returning();
  if (!createdProduct) throw new Error("Failed to insert product");
  return createdProduct;
};

export const getProdctsByUserId = async (userId: UUID) => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.userId, userId))
    .orderBy(desc(productsTable.createdAt));

  if (!products) throw new Error("Products not found for this user");
  return products;
};
