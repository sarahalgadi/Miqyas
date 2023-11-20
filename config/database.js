const mysql = require('mysql2');

// Create the database connection
const database = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  database: 'miqyas',
  user: 'root',
  password: 'miqyas',
});

// Connect to the database
database.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

module.exports = database;
