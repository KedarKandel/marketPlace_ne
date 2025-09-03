import { validator } from "hono/validator";
import { registerSchema } from "../user/userSchema.ts";
import { loginSchema } from "../user/userSchema.ts";


//1. register validator 
export const registerValidator = validator("json", (value, c) => {
  const parsed = registerSchema.safeParse(value);
  
  if (!parsed.success) {
    return c.json(
      { errors: parsed.error.issues.map((issue) => issue.message) },
      400
    );
  }
  return parsed.data;
});


//2. login validator 
export const loginValidator = validator("json", (value, c) => {
  const parsed = loginSchema.safeParse(value);
  if (!parsed.success) {
    return c.json(
      { errors: parsed.error.issues.map((issue) => issue.message) },
      400
    );
  }
  return parsed.data;
});