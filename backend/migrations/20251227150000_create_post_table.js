/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return knex.schema.hasTable('post').then(exists => {
  if (!exists) {
    return knex.schema.createTable("post", function (table) {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("content").notNullable();
    table.string("image");
    table.integer("user_id").unsigned().notNullable();
    table.integer("cat_id").unsigned().notNullable();
    table.timestamps(true, true);
    table.integer("is_delete").notNullable().defaultTo(0);
    table.string("slug").notNullable();
    table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("cat_id").references("id").inTable("categories").onDelete("CASCADE");
  });
}});
}



/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("post");
  
};
