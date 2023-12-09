const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: "mysql-mq-24295.nodechef.com",
    port: 2491,
    user: "root",
    password: "K1MetxGQbl:k2LV4PugGW:tBXvB6bBSv",
    database: "miqyas"
   // connectionLimit: 10,
   // queueLimit: 0,
});

console.log('Connected to the database!');

module.exports = pool;
