const knex = require("knex");

const configs = require("./knexfile");

const environment = process.env.NODE_ENV || "development";

const connection = knex(configs[environment]);

module.exports = connection;
