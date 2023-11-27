
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
    const sql = `SELECT DISTINCT semester FROM faculty_role WHERE username = ?`;

    try {
        const [rows] = await pool.execute(sql, [username]);
        const semesters = rows.map(row => row.semester);
        return semesters;
    } catch (error) {
        console.error('Error fetching semester: ', error);
        throw error;
    }
}



module.exports ={ getUserByUsername, getCurrentTerm};

