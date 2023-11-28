const pool = require('../database');


async function getDirectAssessmentTypes(courseCode, term){
    
        const sql = `SELECT da.type, da.weight, c.coursename
        FROM direct_assessment da
        INNER JOIN course c ON da.courseCode = c.coursecode
        WHERE da.courseCode = ? AND da.semester = ?;`;
        try {
            const [rows] = await pool.execute(sql, [courseCode, term]);
            return rows;
        } catch (error) {
            console.error('Error fetching direct assessment:', error);
            throw error;
        }
    
}

async function saveAssessmentDetailsToDatabase(courseCode, assessmentNumber, statment, grade, CLONumber, semester, type, sectionNumbber) {
    const sql = `
        INSERT INTO assessment_details (coursecode, assessmentNumber, statment, grade, CLONumber, semester, type, sectionNumber)
        VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
    `;

    try {
        const [result] = await pool.execute(sql, [courseCode, term, type, assessmentNumber, statement, grade, cloNumber]);
        return result;
    } catch (error) {
        console.error('Error saving assessment details:', error);
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
    saveAssessmentDetailsToDatabase,
    getStudentInfo
}