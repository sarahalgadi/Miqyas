
const pool = require('../database');

//-------------------------------------------------------------------------

//get number of students under each category for clos across course
async function getCourseCategoryCounts(courseCode, semester, department = null) {
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


//calculate all indirect assessment results for a specific course & semester
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

//todo: date here is retrieved as yyyy-mm-dd:hh-mm-ss... change it to look more userfriendly.
async function getAllActionPlans(courseCode, semester) { 
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

// action plan value update.. in case it was selected/ deselected
async function updateSelectedActionPlans(courseCode, term, formData) { 
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


async function getRecommendation(courseCode, term) {
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

//getting sem and coursecode of course reports that are finished.
async function getCoursesWithReports(department){ 
  const sql = `SELECT r.courseCode, r.semester
      FROM recommendation r
      JOIN course c ON r.courseCode = c.courseCode
      WHERE c.department = ?`;
  try {
        const [result] = await pool.execute(sql, [department]);
        return result;
           } catch (error) {
                     console.error('Error in fetching course info:', error);
                     throw error;
                 }


}



  module.exports = {
    getCourseCategoryCounts,
    calculateIndirectPerCLO,
    getAllActionPlans,
    saveRecommendation,
    updateSelectedActionPlans,
    getRecommendation,
    getSelectedActionPlan, //for viewing course report controller
    getCoursesWithReports
  };