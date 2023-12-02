const pool = require('../database');



//-----------------------------------

//saving direct assessment types and weights made by cc
async function addTypeAndWeight(courseCode, type, weight, term) {
    const sql = 'INSERT INTO direct_assessment (courseCode, type, weight, semester) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE weight = VALUES(weight), type = VALUES(type)';
    try {
        const [result] = await pool.execute(sql, [courseCode, type, weight, term]); 
    } catch (error) {
        console.error('Error saving direct assessment:', error);
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

//this is for terms w submitted course report for a specified course code.
async function getPastCourseReportSemesters(courseCode){
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


module.exports ={ 
    addTypeAndWeight,
     getCoordinatedSections,
    getPastCourseReportSemesters};



