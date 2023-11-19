const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'miqyasdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getAllCourses() {
    const [rows, fields] = await pool.execute('SELECT * FROM course');
    console.log('Fields:', fields);
    console.log('rows', rows);
    return rows;
  }

  module.exports = {
    getAllCourses
  };