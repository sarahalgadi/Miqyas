
const pool = require('../database');


async function getUserByUsername(username) {
    const sql = `
      SELECT * FROM faculty
      WHERE username = ?
    `;
    try {
        const [rows] = await pool.execute(sql, [username]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }

  }

  async function getCurrentTerm(username) {
    const sql = `SELECT DISTINCT semester FROM faculty_role WHERE username = ? ORDER BY semester DESC`;

    try {
        const [rows] = await pool.execute(sql, [username]);
        const semesters = rows.map(row => row.semester);
        return semesters[0];
    } catch (error) {
        console.error('Error fetching semester: ', error);
        throw error;
    }
}

//this is for getting instructor's courses
async function getCourses(username, semester) {
    const sql = `
        SELECT cs.courseCode, cs.sectionNumber, cs.semester, c.courseName
        FROM course_section cs
        JOIN course c ON cs.courseCode = c.courseCode
        WHERE cs.username = ? AND cs.semester = ?`;

    try {
        const [rows] = await pool.execute(sql, [username, semester]);
        return rows;
    } catch (error) {
        console.error('Error fetching courses with names', error);
        throw error;
    }
}

//this is used to get user roles for authentication purposes
async function getUserRoles(username, semester) {
    const sql = `SELECT DISTINCT role FROM faculty_role WHERE username = ? AND semester = ?`;

    try {
        const [rows] = await pool.execute(sql, [username, semester]);
        const roles = rows.map(row => row.role);
        return roles;
    } catch (error) {
        console.error('Error fetching user roles: ', error);
        throw error;
    }
}

//show courses user is coordinating
async function getCoordinatedCourses(username, semester) {
    const sql = `
        SELECT c.courseCode, cr.courseName
        FROM coordinator c
        JOIN course cr ON c.courseCode = cr.courseCode
        WHERE c.username = ? AND c.semester = ?
    `;

    try {
        const [rows] = await pool.execute(sql, [username, semester]);
        return rows; // Assuming a coordinator is assigned to only one course
    } catch (error) {
        console.error('Error fetching coordinated course: ', error);
        throw error;
    }
}

async function getInstructedCourses(username, semester){
    const sql = `SELECT courseCode, sectionNumber FROM course_section WHERE username = ? AND semester = ?`;
    try {
        const [rows] = await pool.execute(sql, [username, semester]);
        return rows; 
    } catch (error) {
        console.error('Error fetching course: ', error);
        throw error;
    }
}

async function getUserCollege (department){
    const sql = 'SELECT college FROM department WHERE departmentName = ?';
    try{
        const[result] = await pool.execute(sql, [department]);
        const college = result.map(row => row.college);
        return college;

    } catch(error){
        console.log("error getting college name", error)
    }
}


async function getUserRoleQA(username) {
    const sql = `SELECT DISTINCT role FROM faculty_role WHERE username = ?`;

    try {
        const [rows] = await pool.execute(sql, [username]);
        const roles = rows.map(row => row.role);
        return roles;
    } catch (error) {
        console.error('Error fetching user roles: ', error);
        throw error;
    }
}




module.exports ={ getUserByUsername, getCurrentTerm, getCourses, getUserRoles, getCoordinatedCourses, getInstructedCourses, getUserCollege, getUserRoleQA};

