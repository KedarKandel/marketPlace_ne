import { Hono } from "hono";
import {
  loginValidator,
  registerValidator,
} from "../validators/user/userValidator.ts";
import { authenticateUser, insertUser } from "../db/queries/auth.queries.ts";
import { generateJwtToken } from "../helpers/generateJwtToken.ts";
import { setCookie } from "hono/cookie";
import { cookieOptions } from "../helpers/cookieOptions.ts";

const router = new Hono();

// register route
router.post("/register", registerValidator, async (c) => {
  // validate the user inputs
  // inser user into database
  // generate a jwt token
  // set cookie with the jwt
  // send success message
  // send error message
  const userData = c.req.valid("json");
  try {
    const newUser = await insertUser(userData);
    const token = await generateJwtToken(newUser.id);
    setCookie(c, "authToken", token, cookieOptions);
    // hide password

    return c.json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    // drizzle nests pg error inside(error === error.cause)
    if (
      error instanceof Error &&
      error.cause instanceof Error &&
      error.cause.message.includes(
        "duplicate key value violates unique constraint"
      )
    ) {
      return c.json({ error: "Email already exists" }, 409);
    } else {
      console.log(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
});

// login route
router.post("/login", loginValidator, async (c) => {
  const userReq = c.req.valid("json");

  try {
    const user = await authenticateUser(userReq.email, userReq.password);
    const token = await generateJwtToken(user.id);
    setCookie(c, "authToken", token, cookieOptions);

    return c.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      200
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("User not found")) {
        return c.json({ error: "User not found" }, 404);
      }
      if (error.message.includes("Invalid credentials")) {
        return c.json({ error: "Invalid credentials" }, 401);
      }
    }

    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default router;
