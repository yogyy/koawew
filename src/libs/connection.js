import knex from "knex";
import "dotenv/config";
import config from "../../knexfile.js";

export const db = knex(config["development"]);
