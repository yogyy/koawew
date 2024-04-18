import "dotenv/config";

/**
 * @type { Object.<string, import('knex').Knex.Config> }
 */
const config = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DB_URI,
    },
    migrations: {
      directory: "./knex/migrations",
    },
    seeds: {
      directory: "./knex/seeds",
    },
    useNullAsDefault: true,
  },
};

export default config;
