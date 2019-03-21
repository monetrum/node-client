"use strict";

async function upsert(knex, table, values, keys) {
  try {
    let instance = knex(table);
    for (let key of keys) {
      instance = instance.where(key, "=", values[key]);
    }
    let first = await instance.first("id");
    if (!first) {
      return await knex(table).insert(values);
    }
    return await instance.update(values);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = upsert; 
