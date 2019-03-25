exports.up = function(knex, Promise) {
  knex.schema.hasTable("wallets").then(function(exists) {
    if (!exists) {
      return knex.schema.createTable("wallets", function(t) {
        t.increments("id").primary();
        t.string("account_id").notNullable();
        t.string("asset");
        t.string("address").notNullable();
        t.string("insert_time");
        t.string("public_key").notNullable();
        t.string("private_key").notNullable();
        t.string("contract_id");
        t.timestamps(false, true);
      });
    } else {
      return null;
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("wallets");
};
