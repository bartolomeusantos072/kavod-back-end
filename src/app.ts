import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";

import { connectDb, disconnectDB } from "@/config";

loadEnv();
import { handleApplicationErrors } from "./middlewares/error-handling-middleware";
import { loadEnv } from "./config/env";
import router from "./routers";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}
  
export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
