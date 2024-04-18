/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("koa_user", (table) => {
    table.string("id", 100).unique().primary();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("username", 100).unique().notNullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable("koa_user");
}
