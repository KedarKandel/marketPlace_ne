import { Hono } from "hono";
import { getProdctsByUserId } from "../db/queries/product.queries";
import type { UUID } from "crypto";

const router = new Hono();

// get all products by userId
router.get("/", async (c) => {
  const userId = c.req.query("userId");
  console.log(userId)
  if (!userId) {
    return c.json({ error: "UserId is not provided" }, 400);
  }
  try {
    const products = await getProdctsByUserId(userId as UUID);
    return c.json(products, 200);
  } catch (error) {
    console.error("Error fetching prodcuts", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default router