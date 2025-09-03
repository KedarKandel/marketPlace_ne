import { validator } from "hono/validator";
import { registerSchema } from "../user/userSchema";
import { loginSchema } from "../user/userSchema";



// register validator 
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


// login validator 
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