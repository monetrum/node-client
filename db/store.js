/* 
Knex.js is SQL query builder for SQLITE3 designed to be flexible, portable and fun to use
Document: http://knexjs.org/
*/

const knex = require("../knex/knex.js");
const upsert = require("../helpers/upsert");

async function persistWallet(account_id, public_key, private_key, address) {
  try {
    let walletData = {
      account_id: account_id,
      public_key: public_key,
      private_key: private_key,
      address: address
    };
    let result = await upsert(knex, "wallets", walletData, ["address"]);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

async function getSqliteMaster() {
  return await knex("sqlite_master").select("*");
}

module.exports = {
  persistWallet,
  getSqliteMaster
};