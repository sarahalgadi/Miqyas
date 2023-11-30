const pool = require('../database');

async function getCourseDetails(courseCode) {
    try {
        const sql = 'SELECT sectionNumber, semester, courseName from course_section INNER JOIN course ON course_section.courseCode = course.courseCode WHERE course_section.courseCode = ?';
        const [row] = await pool.query(sql, [courseCode]);
        if (row.length > 0) {
            return {
                section: row[0].sectionNumber,
                term: row[0].semester,
                courseName: row[0].courseName
            };
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Error fetching course section: ' + error.message);
    }
};

//----------DOES NOT WORK, TRY AGAIN bs tmw its 3 am rn and im so done -------
//function to save indirect assessment into db
async function saveIndirectAssessmentData(indirectAssessmentData) {
    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Begin the transaction
        await connection.beginTransaction();

        const {
            courseCode,
            semester,
            sectionNumber,
            totalResponses,
            CLONumber,
            NumNotSatisfied,
            NumBarelySatisfied,
            NumSatisfied,
            NumAdequatelySatisfied,
            NumFullySatisfied
        } = indirectAssessmentData;

        const first_query = `
            INSERT INTO indirect_assessment (
                CLONumber, courseCode, semester, sectionNumber, 
                NumFullySatisfied, NumAdequatelySatisfied, NumSatisfied,
                NumBarelySatisfied, NumNotSatisfied
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const second_query = `
        INSERT INTO indirect_assessment_responses (
            courseCode, semester, sectionNumber, 
            totalResponses) VALUES (?, ?, ?, ?)`;

        // Execute the first query
        await connection.query(query1, [
            courseCode,
            semester,
            sectionNumber,
            CLONumber,
            NumNotSatisfied,
            NumBarelySatisfied,
            NumSatisfied,
            NumAdequatelySatisfied,
            NumFullySatisfied
        ]);

        // Execute the second query
        await connection.query(query2, [
            courseCode,
            semester,
            sectionNumber,
            totalResponses
        ]);

        // Commit the transaction
        await connection.commit();
        
        // Release the connection back to the pool
        connection.release();

        console.log('Data saved successfully');
    } catch (error) {
        // Rollback the transaction if any query fails
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        throw new Error('Error saving data to the database');
    }
};
module.exports = {
    getCourseDetails,
    saveIndirectAssessmentData
}

