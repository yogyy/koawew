import "dotenv/config";
import Router from "@koa/router";
import Koa from "koa";
import jwt from "koa-jwt";
import userRoute from "./src/routes/userRoute.js";
import authRoute from "./src/routes/authRoute.js";
import { bodyParser } from "@koa/bodyparser";
import morgan from "koa-morgan";
import pino from "pino";

const app = new Koa();
const router = new Router();
const logger = pino({
  level: "debug",
  transport: {
    target: "pino-pretty",
  },
});
app.use(
  morgan("combined", {
    stream: {
      write: (msg) => {
        logger.info(msg.trim());
      },
    },
  })
);
app.use(bodyParser());
// app.use(responseTimeMiddleware);
// app.use(measureResponseTimeMiddleware);
// app.use(jwt({ secret: process.env.JWT_SECRET }));

app.use(userRoute.routes());
app.use(authRoute.routes());
app.use(router.routes());

app.listen(3000);
