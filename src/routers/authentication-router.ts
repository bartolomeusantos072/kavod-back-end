import { Router } from "express";
import { validateBody } from "../middlewares/validation-middleware";
import { signInSchema } from "@/schemas/authentication-schemas";
import { singInPost } from "../controllers/authentication-controller";

const authRouter = Router();

authRouter.post(
  "/sign-in",
  validateBody(signInSchema),
  singInPost
);

export default authRouter;
