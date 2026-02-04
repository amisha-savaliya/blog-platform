exports.up = async function (knex) {
  const exists = await knex.schema.hasColumn('users', 'is_active');

  if (!exists) {
    return knex.schema.alterTable('users', (table) => {
      table.boolean('is_active').defaultTo(false);
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasColumn('users', 'is_active');

  if (exists) {
    return knex.schema.alterTable('users', (table) => {
      table.dropColumn('is_active');
    });
  }
};
