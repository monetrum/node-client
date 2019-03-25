module.exports = {
  development: {
    client: "sqlite3",
    dialect: "sqlite3",
    connection: {
      filename: __dirname + "/db/monetrum.sqlite"
    },
    migrations: {
      tableName: "knex_migrations",
      directory: __dirname + "/knex/migrations"
    },
    seed: {
      directory: __dirname + "/knex/seeds"
    },
    useNullAsDefault: true
  }
};
