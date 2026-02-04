/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('contact').then(exists => {
    if (!exists) {
  return knex.schema.createTable("contact", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.text("msg").notNullable();
    table.timestamp(true, true);
    table.integer("is_action").notNullable().defaultTo(0);
  });
}});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("contact");
};
