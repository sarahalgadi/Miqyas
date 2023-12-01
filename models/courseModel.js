const pool = require('../database');


async function getCLOInfo(courseCode, semester) {
    const sql = 'SELECT  clo.statement, clo.CLONumber FROM course_learning_outcomes clo WHERE clo.courseCode = ? AND clo.semester = ?';
    const [rows, fields] = await pool.execute(sql, [courseCode, semester]);
    const CLOstatements = rows.map(row => row.statement);
    const CLOnumbers = rows.map(row => row.CLONumber);
    return {CLOstatements, CLOnumbers };
  }

  
async function getCourseName(courseCode) { 
    const sql = 'SELECT courseName FROM course WHERE courseCode = ?';
    const [rows] = await pool.execute(sql, [courseCode]);
    return rows.length > 0 ? rows[0].courseName : null;
  }


  async function getCLOInfo(courseCode, semester) { 
    const sql = 'SELECT  clo.statement, clo.CLONumber FROM course_learning_outcomes clo WHERE clo.courseCode = ? AND clo.semester = ?';
    const [rows, fields] = await pool.execute(sql, [courseCode, semester]);
    const CLOstatements = rows.map(row => row.statement);
    const CLOnumbers = rows.map(row => row.CLONumber);
    return {CLOstatements, CLOnumbers };
  }

  async function getDepartments() { /////////todo:move to course..
    const sql = 'SELECT departmentName FROM department';
    const [rows] = await pool.execute(sql);
    const departmentNames = rows.map(row => row.departmentName);
    return departmentNames;
  }

 
module.exports={}