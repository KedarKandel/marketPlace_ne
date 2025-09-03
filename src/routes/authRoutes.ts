import { Hono } from "hono";
import {
  loginValidator,
  registerValidator,
} from "../validators/user/userValidator";
import {
  getUserByUserEmail,
  insertUser,
  type NewUserType,
} from "../db/queries/user.queries";
import { generateJwtToken } from "../helpers/generateJwtToken";
import { setCookie } from "hono/cookie";
import { cookieOptions } from "../helpers/cookieOptions";

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
    return c.json({ message: "User registered successfully", newUser });
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
    const user = await getUserByUserEmail(userReq.email);

    if (!user) {
      return c.json({ messsage: "Invalid credentials" });
    }

    const isValidUser = Bun.password.verify(userReq.password, user.password);
    if (!isValidUser) {
      return c.json({ message: "Invalid creadentials" });
    }
    const token = await generateJwtToken(user.id);
    setCookie(c, "authToken", token, cookieOptions);

    // remove password before sending respose user
    const { password, ...safeUser } = user;
    return c.json({
      message: "Login seccessful",
      safeUser,
    });
  } catch (error) {
    console.log(error);
    return c.json({
      error: "Unable to login",
    });
  }
});

export default router;
