exports.up = function (knex, Promise) {
  return knex.schema.createTable('filmes', (table) => {
    table.increments('id').primary();
    table.string('titulo').notNullable();
    table.string('diretor').notNullable();
    table.integer('quantidade').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('filmes');
};
