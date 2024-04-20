import { db } from "../libs/connection.js";

/**
 * Registers a new user in the database.
 * @param {Object} userData - Object containing user data.
 * @param {string} userData.id - The unique identifier for the user.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The password of the user.
 * @param {string} userData.username - The username of the user.
 * @returns {Promise<Pick<User, 'id' | 'email' | 'username'>>}
 */

export async function registerUser({ id, email, password, username }) {
  await db("koa_user")
    .insert({ id, email, password, username })
    .returning(["id", "email", "username"]);
}

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
 * @typedef {Object} User
 * @property {string} id - The unique identifier of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} username - The username of the user.
 * @property {string} created_at - The timestamp when the user was created.
 * @property {string} updated_at - The timestamp when the user was last updated.
 */
