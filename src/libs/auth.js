import { db } from "./connection.js";
import * as jose from "jose";
import { secret } from "./utils.js";

/**
 * @typedef {Object} User
 * @property {string} id - The unique identifier of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} username - The username of the user.
 * @property {string} created_at - The timestamp when the user was created.
 * @property {string} updated_at - The timestamp when the user was last updated.
 */

/**
 * Finds a user by email.
 * @param {string} email - The email address of the user.
 * @returns {Promise<{ user: User, isExist: boolean }>} A promise that resolves to an object containing the user and a boolean indicating whether the user exists.
 */
export async function findUser(email) {
  const [user] = await db("koa_user")
    .select("*")
    .whereRaw("koa_user.email = ?", email);

  return { user, isExist: !!user };
}

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
