const knex = require("knex");
const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

const db = knex({
	client: "pg",
	version: "12.5",
	connection: {
		host: DB_HOST,
		user: DB_USERNAME,
		password: DB_PASSWORD,
		database: "postgres",
	},
});

module.exports = db;
