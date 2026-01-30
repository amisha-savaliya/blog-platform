/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return knex.schema.createTable("comments", function (table) {
    table.increments("id").primary();
    table.text("comment").notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.integer("post_id").unsigned().notNullable();
    table.timestamps(true, true);
    table.integer("is_approved").notNullable().defaultTo(0);
    table.integer("is_delete").notNullable().defaultTo(0);
    table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");;
    table.foreign("post_id").references("id").inTable("post").onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("comments");
};
