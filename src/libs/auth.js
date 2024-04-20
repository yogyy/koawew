import { db } from "./connection.js";
import * as jose from "jose";
import { secret } from "./utils.js";

/**
 * @param {import("jose").JWTPayload & {sub: string, email: string}} payload
 */
export async function generateToken(payload) {
  return await new jose.SignJWT({
    sub: payload.sub,
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(secret);
}
