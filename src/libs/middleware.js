import { jwtVerify } from "jose";
import { secret } from "./utils.js";

const responseTimeMiddleware = async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
};

const measureResponseTimeMiddleware = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
};

const messages = {
  badRequestErrorMessage: "Format is Authorization: Bearer [token]",
  badCookieRequestErrorMessage: "Cookie could not be parsed in request",
  noAuthorizationInHeaderMessage:
    "No Authorization was found in request.headers",
  noAuthorizationInCookieMessage:
    "No Authorization was found in request.cookies",
  authorizationTokenExpiredMessage: "Authorization token expired",
  authorizationTokenInvalid: (err) =>
    `Authorization token is invalid: ${err.message}`,
  authorizationTokenUntrusted: "Untrusted authorization token",
  authorizationTokenUnsigned: "Unsigned authorization token",
};

/**
 * Middleware for handling authorization.
 * @param {import("koa").ParameterizedContext} ctx - Koa context object.
 * @param {Function} next - Next middleware function.
 * @returns {Promise<void>} Promise representing the completion of the middleware.
 */

const authMiddleware = async (ctx, next) => {
  const authorizationHeader = ctx.headers.authorization;

  if (!authorizationHeader) {
    ctx.throw(401, messages.noAuthorizationInHeaderMessage);
  }

  if (!authorizationHeader.startsWith("Bearer ")) {
    ctx.throw(401, messages.badRequestErrorMessage);
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    ctx.throw(401, messages.noAuthorizationInHeaderMessage);
  }

  try {
    await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    await next();
  } catch (error) {
    console.log(error);
    if (error.code === "ERR_JWT_EXPIRED") {
      ctx.throw(401, messages.authorizationTokenExpiredMessage);
    } else if (error.code === "ERR_JWT_INVALID") {
      ctx.throw(401, messages.authorizationTokenUntrusted);
    }
    ctx.throw(401, messages.authorizationTokenInvalid(error));
  }
};

export {
  responseTimeMiddleware,
  measureResponseTimeMiddleware,
  authMiddleware,
};
