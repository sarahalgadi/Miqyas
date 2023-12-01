

const pool = require('../database');

//todo: change the name of the model.


///REMOVE------------------------------------------------
async function getCourseName(courseCode) {
    const sql = 'SELECT courseName FROM course WHERE courseCode = ?';
    const [rows] = await pool.execute(sql, [courseCode]);
    return rows.length > 0 ? rows[0].courseName : null;
  }
//-----------------------------------

//Here, i will get the course name for the selected coursecode.


async function addTypeAndWeight(courseCode, type, weight, term) {
    const sql = 'INSERT INTO direct_assessment (courseCode, type, weight, semester) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE weight = VALUES(weight), type = VALUES(type)';
    try {
        const [result] = await pool.execute(sql, [courseCode, type, weight, term]); 
    } catch (error) {
        console.error('Error saving direct assessment:', error);
        throw error;
    }
}

//getting type and weight for saved activities in the same term and course
//fixme: move to course 
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

//getting sections under the course you're coordinating 
async function getCoordinatedSections(courseCode, term) {
    const sql = 'SELECT sectionNumber FROM course_section WHERE courseCode = ? AND semester = ?';
    try {
        const [rows] = await pool.execute(sql, [courseCode, term]);
        const sectionNumbers = rows.map(row => row.sectionNumber);
        return sectionNumbers;
    } catch (error) {
        console.error('Error fetching course sections:', error);
        throw error;
    }
}

async function getPastCourseReportSemesters(courseCode){
    // we use recommendation for fetching course report since it's the only thing that can be traced back to coordinator reports.
    const sql = 'SELECT semester FROM recommendation WHERE courseCode = ?';
    try{
        const[rows] = await pool.execute(sql, [courseCode]);
        const semesters = rows.map(row => row.semester);
        return semesters;
    } catch(error){
        console.error('error fetching course report semesters:', error);
        throw error;
    }
}

//todo: handling the case where the user clicks "view report"; will be done after section report is finalized

module.exports ={getCourseName, 
    addTypeAndWeight,
     getDirect, 
     getCoordinatedSections,
    getPastCourseReportSemesters};



