/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('blog_settings').then(exists => {
    if (!exists) {
  return knex.schema.createTable("blog_settings", (table) => {
    table.increments("id").primary();
  
    table.string("admin_email").notNullable();
    table.string("contact").notNullable(15);
    table.text("address").notNullable();

    table.integer("posts_per_page").defaultTo(5);
    table.boolean("allow_comments").defaultTo(true);
  
    table.timestamps(true, true);
  });
}});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("blog_settings");
};
