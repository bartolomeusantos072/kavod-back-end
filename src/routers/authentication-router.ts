import { Router } from "express";
import { validateBody } from "../middlewares/validation-middleware";
import { createUserSchema } from "../schemas/users-schemas";
import { signInSchema } from "@/schemas/authentication-schemas";
import { singInPost } from "../controllers/authentication-controller";
import { usersPost } from "@/controllers";

const authRouter = Router();

authRouter.post(
  "/sign-up",
  validateBody(createUserSchema),
  usersPost
);
authRouter.post(
  "/sign-in",
  validateBody(signInSchema),
  singInPost
);

export default authRouter;
