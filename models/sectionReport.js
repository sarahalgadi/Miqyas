const pool = require('../database');


////////----to removeeeeeeeeeeeeeeeee-------------------
async function getCourseName(courseCode) {
    const sql = 'SELECT courseName FROM course WHERE courseCode = ?';
    const [rows] = await pool.execute(sql, [courseCode]);
    return rows.length > 0 ? rows[0].courseName : null;
  }


  async function getCLOInfo(courseCode, semester) { //moved to course
    const sql = 'SELECT  clo.statement, clo.CLONumber FROM course_learning_outcomes clo WHERE clo.courseCode = ? AND clo.semester = ?';
    const [rows, fields] = await pool.execute(sql, [courseCode, semester]);
    const CLOstatements = rows.map(row => row.statement);
    const CLOnumbers = rows.map(row => row.CLONumber);
    return {CLOstatements, CLOnumbers };
  }
  async function getDepartments() {
    const sql = 'SELECT departmentName FROM department';
    const [rows] = await pool.execute(sql);
    const departmentNames = rows.map(row => row.departmentName);
    return departmentNames;
  }

  ////////-------------------------------------------------------------------------------

  async function getCategoryCounts(courseCode, semester, section, department = null) { //todo: change the name for sara
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
        sc.semester = ? AND
        sc.sectionNumber = ?

    `;
  
    const params = [courseCode, semester, section];
  
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

  

  async function getIndirectPerCLOPerSection(courseCode, semester, section) {
    const sql = `
      SELECT
        CLONumber,
        SUM(NumFullySatisfied) AS totalFullySatisfied,
        SUM(NumAdequatelySatisfied) AS totalAdequatelySatisfied,
        SUM(NumSatisfied) AS totalSatisfied,
        SUM (NumBarelySatisfied) AS totalBarelySatisfied,
        SUM(NumNotSatisfied) AS totalNotSatisfied
      FROM
        indirect_assessment
      WHERE
        courseCode = ? AND
        semester = ? AND
        sectionNumber = ?
      GROUP BY
        CLONumber;
    `;
  
    const [rows] = await pool.execute(sql, [courseCode, semester, section]);
    return rows;
  }
///////todo: rename this to indicate it's per section
  async function getActionPlans(courseCode, semester, sectionNumber) { 
    const sql = `
        SELECT statement, resources, startDate, endDate, responsibility, CLONumber
        FROM action_plan
        WHERE courseCode = ? AND semester = ? AND sectionNumber = ?;
    `;

    try {
        const [rows] = await pool.execute(sql, [courseCode, semester, sectionNumber]);

        const actionPlans = rows.map((row) => ({
            statement: row.statement,
            resources: row.resources,
            startDate: row.startDate,
            endDate: row.endDate,
            responsibility: row.responsibility,
            courseCode: row.courseCode,
            sectionNumber: row.sectionNumber,
            semester: row.semester,
            CLONumber: row.CLONumber,
        }));

        return actionPlans;
    } catch (error) {
        // Handle error appropriately (e.g., log or throw an exception)
        console.error('Error in getActionPlans:', error);
        throw error;
    }
}

async function saveActionPlan(
    statement,
    resources,
    startDate,
    endDate,
    responsibility,
    courseCode,
    sectionNumber,
    semester,
    CLONumber
) {
    const sql = `
        INSERT INTO action_plan 
        (statement, resources, startDate, endDate, responsibility, courseCode, sectionNumber, semester, CLONumber)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        statement = VALUES(statement),
        resources = VALUES(resources),
        startDate = VALUES(startDate),
        endDate = VALUES(endDate),
        responsibility = VALUES(responsibility);
    `;

    const values =
     [
        statement,
        resources,
        startDate,
        endDate,
        responsibility,
        courseCode,
        sectionNumber,
        semester,
        CLONumber
    ];

    try {
        console.log("SQL QUERY: ", sql);
        console.log("values:", values)
        const [result] = await pool.execute(sql, values);
        console.log('Action plan saved:', result);
    } catch (error) {
        // Handle error appropriately (e.g., log or throw an exception)
        console.error('Error in saveActionPlan:', error);
        throw error;
    }
}


async function saveDirectCLOPerSection(CLONumber, courseCode, sectionNumber, percentageOfCLOAchievement, semester){
    const sql = `
    INSERT INTO directclo_per_section 
    (CLONumber, courseCode, sectionNumber, percentageOfCLOAchievment, semester)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    percentageOfCLOAchievment = VALUES(percentageOfCLOAchievment);
`;

    const values = [
        CLONumber,
        courseCode,
        sectionNumber,
        percentageOfCLOAchievement,
        semester
    ];

    try {
        const [result] = await pool.execute(sql, values);
        console.log('Direct CLO per section saved:', result);
    } catch (error) {
        console.error('Error in saveDirectCLOPerSection:', error);
        throw error;
    }
}

//this function will return course code, section number, and semester of section reports written by a specific instructor
async function getSectionReportCourses(username){
  const sql = `SELECT DISTINCT
                dc.courseCode,
                dc.sectionNumber,
                dc.semester
              FROM
                directclo_per_section dc
              JOIN
                course_section cs
              ON
                dc.courseCode = cs.courseCode
                AND dc.sectionNumber = cs.sectionNumber
                AND dc.semester = cs.semester
              WHERE
                cs.username = ?`;

   try {
     const [result] = await pool.execute(sql, [username]);
     return result;
        } catch (error) {
                  console.error('Error in fetching course report info:', error);
                  throw error;
              }
      
}

async function getDepartmentSectionReports(department){ //get the course code, section and semester of sections who submitted their reports
  const sql = `SELECT DISTINCT d.courseCode, d.sectionNumber, d.semester
                FROM directclo_per_section d
                JOIN course c ON d.courseCode = c.courseCode
                WHERE c.department = ? `;
    try{
      const [result] = await pool.execute(sql, [department]);
      return result;
    } catch(error){
      console.error('error in fetching section report info', error);
      throw error;
    }
}


  //todo: for action plan: delete and update and save!!!

  module.exports = {
    getCourseName,
    getCLOInfo,
    getCategoryCounts,
    getDepartments,
    getIndirectPerCLOPerSection,
    getActionPlans,
    saveActionPlan,
    saveDirectCLOPerSection,
    getSectionReportCourses,
    getDepartmentSectionReports
  }