
const pool = require('../database');


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

async function getCategoryCounts(courseCode, semester, department = null) {
  let sql = `
    SELECT
      sc.CLONumber,
      sc.category,
      COUNT(*) AS studentCount
    FROM
      student_coursesection sc
      JOIN student s ON sc.studentID = s.studentID
    WHERE
      sc.courseCode = ? AND
      sc.semester = ?
  `;

  const params = [courseCode, semester];

  if (department && department !== 'All') {
    sql += ` AND s.department = ?`;
    params.push(department);
  }

  sql += `
    GROUP BY
      sc.CLONumber,
      sc.category;
  `;

  const [rows] = await pool.execute(sql, params);
  return rows;
}



async function getDepartments() {
  const sql = 'SELECT departmentName FROM department';
  const [rows] = await pool.execute(sql);
  const departmentNames = rows.map(row => row.departmentName);
  return departmentNames;
}

async function calculateIndirectPerCLO(courseCode, semester) {
  const sql = `
    SELECT
      CLONumber,
      SUM(NumFullySatisfied) AS totalFullySatisfied,
      SUM(NumAdequatelySatisfied) AS totalAdequatelySatisfied,
      SUM(NumSatisfied) AS totalSatisfied,
      SUM(NumBarelySatisfied) AS totalBarelySatisfied,
      SUM(NumNotSatisfied) AS totalNotSatisfied
    FROM
      indirect_assessment
    WHERE
      courseCode = ? AND
      semester = ?
    GROUP BY
      CLONumber;
  `;

  const [rows] = await pool.execute(sql, [courseCode, semester]);
  return rows;
}

async function getActionPlan(courseCode, semester) {
  const sql = `
    SELECT *
    FROM action_plan
    WHERE courseCode = ? AND semester = ?;
  `;

  const [rows] = await pool.execute(sql, [courseCode, semester]);
  return rows;
}
async function saveRecommendation(courseCode, term, username, recommendation) {
  const sql = `
    INSERT INTO recommendation (courseCode, semester, username, statment)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE statment = VALUES(statment);
  `;
  //the onduplicate key update query is used to update recommendation if user provides one.

  await pool.execute(sql, [courseCode, term, username, recommendation]);
}
async function updateSelectedActionPlans(courseCode, term, formData) { // here im updating action plan value.. in case it was selected/ deselected
  const sqlGetActionPlans = `
    SELECT sectionNumber, CLONumber
    FROM action_plan
    WHERE courseCode = ? AND semester = ?;
  `;

  const sqlUpdate = `
    UPDATE action_plan
    SET selected = ?
    WHERE courseCode = ? AND semester = ? AND sectionNumber = ? AND CLONumber = ?;
  `;

  const [actionPlans] = await pool.execute(sqlGetActionPlans, [courseCode, term]);

  for (const actionPlan of actionPlans) {
    const { sectionNumber, CLONumber } = actionPlan;
    const key = `selection_${sectionNumber}_${CLONumber}`;
    const isSelected = formData[key] === '1' ? 1 : 0;

    // Update the selected column in the action_plan table
    await pool.execute(sqlUpdate, [isSelected, courseCode, term, sectionNumber, CLONumber]);
  }
}

async function getRecommendation(courseCode, term, username) {
  const sql = `
      SELECT statment
      FROM recommendation
      WHERE courseCode = ? AND semester = ? AND username = ?;
  `;

  const [rows] = await pool.execute(sql, [courseCode, term, username]);
  return rows.length > 0 ? rows[0].statment : ''; // return an empty string if no recommendation exists
}

async function getRec(courseCode, term) {
  const sql = `
      SELECT statment
      FROM recommendation
      WHERE courseCode = ? AND semester = ? ;
  `;

  const [rows] = await pool.execute(sql, [courseCode, term]);
  return rows.length > 0 ? rows[0].statment : ''; // return an empty string if no recommendation exists
}


async function getSelectedActionPlan(courseCode, semester) {
  const sql = `
    SELECT *
    FROM action_plan
    WHERE courseCode = ? AND semester = ? AND selected ='1';
  `;

  const [rows] = await pool.execute(sql, [courseCode, semester]);
  return rows;
}






  module.exports = {
    getCLOInfo,
    getCourseName,
    getCategoryCounts,
    getDepartments,
    calculateIndirectPerCLO,
    getActionPlan,
    saveRecommendation,
    updateSelectedActionPlans,
    getRecommendation,
    getRec, //for viewing course report controller
    getSelectedActionPlan //for viewing course report controller
  };