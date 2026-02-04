/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
      return knex.schema.hasTable('role').then(exists => {
    if (!exists) {
    return knex.schema.createTable("role",function(table)
{
    table.increments("id").primary();
    table.string("name").notNullable();
    table.timestamps(true, true); 
    table.integer("is_delete").notNullable().defaultTo(0);
})
    }});
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("role");
  
};
