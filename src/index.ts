import { Hono } from "hono";
import productRoutes from "./routes/productRoutes.ts";
import authRoutes from "./routes/authRoutes.ts"


const PORT = Number(process.env.PORT) || 4000; // default to 4000
const app = new Hono();


// routes
app.route("/api/auth", authRoutes)
app.route("/api/products", productRoutes);


// Start Bun server
Bun.serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`🚀 Server running at http://localhost:${PORT}`);
