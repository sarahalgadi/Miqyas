const pool = require('../database');


async function getDirectAssessmentTypes(courseCode, term){
    
        const sql = 'SELECT type, weight FROM direct_assessment WHERE courseCode = ? AND semester = ?';
        try {
            const [rows] = await pool.execute(sql, [courseCode, term]);
            return rows;
        } catch (error) {
            console.error('Error fetching direct assessment:', error);
            throw error;
        }
    
}

async function getStudentInfo(courseCode, term, section) {
    const sql = `
        SELECT DISTINCT s.studentID, s.firstName, s.lastName
        FROM student s
        INNER JOIN student_coursesection cs ON s.studentID = cs.studentID
        WHERE cs.courseCode = ? AND cs.semester = ? AND cs.sectionNumber = ?
        ORDER BY s.studentID;
    `;

    try {
        const [rows] = await pool.execute(sql, [courseCode, term, section]);
        return rows;
    } catch (error) {
        console.error('Error fetching student information:', error);
        throw error;
    }
}

module.exports = {
    getDirectAssessmentTypes,
    getStudentInfo
}