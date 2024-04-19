import Router from "@koa/router";
import { generateToken, findUser } from "../libs/auth.js";
import { db } from "../libs/connection.js";
import { Argon2id } from "oslo/password";
import pg from "pg";
import { generateId } from "../libs/utils.js";

const { DatabaseError } = pg;
const authRoute = new Router({ prefix: "/api/auth" });

authRoute.post("/register", async (ctx) => {
  const { email, password, username } = ctx.request.body;
  const { isExist } = await findUser(email);
  if (!email || typeof email !== "string" || isExist) {
    return ctx.throw(400, "Invalid email");
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return ctx.throw(400, "Invalid password");
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId("u");

  try {
    await db("koa_user")
      .insert({ id: userId, email, password: hashedPassword, username })
      .returning(["id", "email", "username"]);

    const token = await generateToken({ sub: userId, email });

    ctx.body = { token };
  } catch (error) {
    console.log(error);
    if (error instanceof DatabaseError) {
      if (error.code === "23505") {
        const errorMessage =
          error.constraint === "koa_user_email_unique"
            ? "Email address"
            : "Username";

        return ctx.throw(409, `${errorMessage} already exists`);
      } else {
        return ctx.throw(400, error.message);
      }
    } else {
      return ctx.throw(error.status || 500, error.message);
    }
  }
});

authRoute.post("/login", async (ctx) => {
  const { email, password } = ctx.request.body;

  if (!email) {
    return ctx.throw(403, "email required");
  }

  if (!password) {
    return ctx.throw(403, "password required");
  }

  try {
    const { user } = await findUser(email);

    if (!user) {
      return ctx.throw(404, "User Not Found");
    }

    const verifiedPass = await new Argon2id().verify(user.password, password);

    if (!verifiedPass) {
      return ctx.throw(401, "Invalid Email or Password");
    }

    const token = await generateToken({ sub: user.id, email });
    ctx.body = { token };
  } catch (error) {
    return ctx.throw(error.status, error.message);
  }
});

export default authRoute;
