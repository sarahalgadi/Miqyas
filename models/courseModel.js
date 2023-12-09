const pool = require('../database');


async function getCLOInfo(courseCode, semester) {
    const sql = 'SELECT  clo.statement, clo.CLONumber FROM course_learning_outcomes clo WHERE clo.courseCode = ? AND clo.semester = ?';
    const [rows] = await pool.execute(sql, [courseCode, semester]);
    const CLOstatements = rows.map(row => row.statement);
    const CLOnumbers = rows.map(row => row.CLONumber);
    return {CLOstatements, CLOnumbers };
  }

  
async function getCourseName(courseCode) { 
    const sql = 'SELECT courseName FROM course WHERE courseCode = ?';
    const [rows] = await pool.execute(sql, [courseCode]);
    return rows.length > 0 ? rows[0].courseName : null;
  }



  async function getDepartments() { 
    const sql = 'SELECT departmentName FROM department';
    const [rows] = await pool.execute(sql);
    const departmentNames = rows.map(row => row.departmentName);
    return departmentNames;
  }

  //course codes under user dept
async function getCourseCode (department){
  const [rows] = await pool.execute
  ('SELECT courseCode FROM course WHERE department = ?',[department]);
  return rows;
}

//get direct assessment weight and types
async function getDirect(courseCode, term) {
  const sql = 'SELECT type, weight FROM direct_assessment WHERE courseCode = ? AND semester = ?';
  try {
      const [rows] = await pool.execute(sql, [courseCode, term]);
      return rows;
  } catch (error) {
      console.error('Error fetching direct assessment:', error);
      throw error;
  }
}
 
module.exports={getCourseCode, getCourseName, getDirect, getCLOInfo, getDepartments}