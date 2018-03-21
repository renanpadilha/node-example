exports.up = function (knex, Promise) {
  return knex.schema.createTable('locacoes', (table) => {
    table.increments('id').primary();
    table.integer('id_cliente').references('clientes.id');
    table.integer('id_filme').references('filmes.id');
    table.boolean('devolvido');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('locacoes');
};
