exports.up = function (knex) {
  return knex.schema.hasTable("user_invites").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("user_invites", (table) => {
        table.increments("id").primary();
        table.string("email").notNullable();
        table.enu("role").notNullable();
        table.string("token").notNullable();
        table.timestamp("expires_at").notNullable();
        table.boolean("used").defaultTo(false);
        table.timestamps(true, true);
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_invites");
};
