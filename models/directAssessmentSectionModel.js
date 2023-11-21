const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'miqyas',
  waitForConnection: true,
  connectionLimit: 10,
  queueLimit: 0
});

//probably need to restructure the models :) 


module.exports ={getAssessmentType, };
