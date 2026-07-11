require("dotenv").config()
const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "projects",
    connectionLimit: 5
});

module.exports = pool;
