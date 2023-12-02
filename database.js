const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'miqyas',
    database: 'miqyas',
    waitForConnection: true,
    connectionLimit: 10,
    queueLimit: 0,
});

console.log('Connected to the database!');

module.exports = pool;
