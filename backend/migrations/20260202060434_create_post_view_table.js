/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema.hasTable('post_view').then(exists => {
    if (!exists) {
     
   return knex.schema.createTable("post_view", function(table)
    {
        table.increments("id").primary();

    table
      .integer("post_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("post")
      .onDelete("CASCADE");

    table
      .integer("user_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("ip_address", 45);

    table.timestamp("created_at").defaultTo(knex.fn.now());

    
    table.unique(["post_id", "user_id"]);
    table.unique(["post_id", "ip_address"]);
  });
}})
};

  


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("post_view");
  
};