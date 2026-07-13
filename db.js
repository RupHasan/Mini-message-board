require("dotenv").config()
const mysql = require('mysql2');
const fs = require('fs');
const pool = mysql.createPool({
  host: 'mysql-1ee870bf-hasanrup7-c79f.c.aivencloud.com',
  user: 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: 'defaultdb',
  port: 11535,
  ssl: {
    ca: fs.readFileSync("./ca.pem")
  }
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to Aiven:', err.message);
  } else {
    console.log('Successfully connected to Aiven database!');
    connection.release();
  }
});

module.exports = pool.promise();