/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("contact", function (table) {
    table.increments("id").primary();
    table.string("name", 150).notNullable();
    table.string("email", 150).notNullable();
    table.text("msg").notNullable();

    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.integer("is_delete").notNullable().defaultTo(0);

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  return knex.schema.dropTable("contact");
};
