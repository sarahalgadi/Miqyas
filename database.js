const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "miqyasdb"
   // connectionLimit: 10,
   // queueLimit: 0,
});

console.log('Connected to the database!');

module.exports = pool;
