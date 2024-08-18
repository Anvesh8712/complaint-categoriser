const knex = require("knex")(require("./knexfile"));
const environment = process.env.NODE_ENV || "development";

module.exports = knex(configs[environment]);
