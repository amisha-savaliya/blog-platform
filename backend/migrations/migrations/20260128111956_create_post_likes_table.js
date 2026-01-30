/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("post_likes", function (table) {
    table.increments("id").notNullable();
    table.integer("post_id").unsigned().notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.timestamps(true, true);
    table.unique(["post_id", "user_id"]);
    table
      .foreign("post_id")
      .references("id")
      .inTable("post")
      .onDelete("CASCADE");

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("post_likes");
};
