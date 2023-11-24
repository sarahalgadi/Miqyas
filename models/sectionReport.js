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

  async function getCategoryCounts(courseCode, semester, section, department = null) {
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

  async function getDepartments() {
    const sql = 'SELECT departmentName FROM department';
    const [rows] = await pool.execute(sql);
    const departmentNames = rows.map(row => row.departmentName);
    return departmentNames;
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

  //todo: for action plan: delete and update and save!!!

  module.exports = {
    getCourseName,
    getCLOInfo,
    getCategoryCounts,
    getDepartments,
    getIndirectPerCLOPerSection,
    getActionPlans
  }