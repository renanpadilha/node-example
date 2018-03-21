module.exports = {
  development: {
    client: 'pg',
    debug: true,
    connection: {
      // debug: true,
      pool: { max: 1, min: 1 },
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      database: 'node-example',
      password: '123'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: 'pg',
    connection: {
      // debug: true,
      pool: { max: 1, min: 1 },
      host: '',
      port: 5432,
      user: '',
      database: '',
      password: '',
      ssl: true
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};