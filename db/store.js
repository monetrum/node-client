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

async function getWalletsCreatedOnNodeClient({
  account_id,
  address,
  public_key,
  private_key
}) {
  let whereClause = "";
  if (account_id) {
    whereClause += "wallets.account_id='" + account_id + "'";
  }
  if (address) {
    if (whereClause) {
      whereClause += " and ";
    }
    whereClause += "wallets.address='" + address + "'";
  }

  if (public_key) {
    if (whereClause) {
      whereClause += " and ";
    }
    whereClause += "wallets.public_key='" + public_key + "'";
  }

  if (private_key) {
    if (whereClause) {
      whereClause += " and ";
    }
    whereClause += "wallets.private_key='" + private_key + "'";
  }

  return await knex("wallets")
    .whereRaw(whereClause)
    .orderBy("updated_at", "desc");
}

module.exports = {
  persistWallet,
  getSqliteMaster,
  getWalletsCreatedOnNodeClient
};
