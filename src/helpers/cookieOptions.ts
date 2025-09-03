
import type { CookieOptions } from "hono/utils/cookie";

// cookie options
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  path: "/",
  maxAge: 3600,
} as CookieOptions;