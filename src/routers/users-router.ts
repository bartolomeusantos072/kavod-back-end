import { Router } from "express";

import { createUserSchema } from "@/schemas/users-schemas";
import { validateBody } from "@/middlewares";
import { usersPost } from "@/controllers";

const usersRouter = Router();

usersRouter.post("/sign-up", validateBody(createUserSchema), usersPost);

export { usersRouter };
