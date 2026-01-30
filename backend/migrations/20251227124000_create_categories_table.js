/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return knex.schema.createTable("categories",function(table)
{
    table.increments("id").primary();
    table.string("name").notNullable();
    table.timestamps(true, true); 
    table.integer("is_delete").notNullable().defaultTo(0);
})
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("categories");
  
};
