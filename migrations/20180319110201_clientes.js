exports.up = function(knex, Promise) {
  return knex.schema.createTable('clientes', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('email').unique().notNullable();
    table.string('senha').notNullable();
    table.uuid('token');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('clientes');
};
