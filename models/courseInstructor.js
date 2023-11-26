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

module.exports = {
    getDirectAssessmentTypes
}