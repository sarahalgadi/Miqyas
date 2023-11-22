

const pool = require('../database');

//Here, i will get the course name for the selected coursecode.
async function getCourseName(courseCode) {
    const sql = 'SELECT courseName FROM course WHERE courseCode = ?';
    const [rows] = await pool.execute(sql, [courseCode]);
    return rows.length > 0 ? rows[0].courseName : null;
  }

async function addTypeAndWeight(courseCode, type, weight, term) {
    const sql = 'INSERT INTO direct_assessment (courseCode, type, weight, semester) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE weight = VALUES(weight), type = VALUES(type)';
    try {
        const [result] = await pool.execute(sql, [courseCode, type, weight, term]); 
    } catch (error) {
        console.error('Error saving direct assessment:', error);
        throw error;
    }
}

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

module.exports ={getCourseName, addTypeAndWeight, getDirect};



