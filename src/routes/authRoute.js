import Router from "@koa/router";
import {
  loginHandler,
  registerHandler,
} from "../controllers/auth.controller.js";

const authRoute = new Router({ prefix: "/api/auth" });

authRoute.post("/register", registerHandler);

authRoute.post("/login", loginHandler);

export default authRoute;
