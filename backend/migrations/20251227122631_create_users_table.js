/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.integer("role_id").unsigned().notNullable();
    table.timestamps(true, true); 
    table.integer("is_delete").notNullable().defaultTo(0);
    table.integer("is_blocked").notNullable().defaultTo(0);
    table.text("token");
    table.foreign("role_id").references("id").inTable("role").onDelete("CASCADE");
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async    function(knex) {
    return knex.schema.dropTable("users");
    
  
};
