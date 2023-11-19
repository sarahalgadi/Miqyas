const mysql = require('mysql2');

// Function to create and establish the database connection
function connectDatabase() {
  // Create the database connection
  const database = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'miqyasdb',
    user: 'root',
    password: 'root',
  });

  // Connect to the database
  database.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to database');
  });

  return database;
}

module.exports = connectDatabase;
