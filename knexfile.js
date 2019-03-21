module.exports = {
  client: "sqlite3",
  dialect: "sqlite3",
  connection: {
    filename: __dirname + "/db/monetrum.sqlite"
  },
  useNullAsDefault: true
};
