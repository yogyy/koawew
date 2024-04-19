import { nanoid } from "nanoid";

const generateId = (prefix = "", length = 22) => `${prefix}_${nanoid(length)}`;

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export { generateId, secret };
