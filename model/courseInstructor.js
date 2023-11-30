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

//----------Saving function is successful, but the actual data isn't being stored.. --
//function to save indirect assessment into db
async function saveIndirectAssessmentData(CLONumber, courseCode, semester, sectionNumber, NumFullySatisfied, NumAdequatelySatisfied, NumSatisfied, NumBarelySatisfied, NumNotSatisfied, totalResponses) {
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
        
    try{
        const [rows] = await pool.execute(first_query, second_query , [CLONumber, courseCode, semester, sectionNumber, NumFullySatisfied, NumAdequatelySatisfied, NumSatisfied, NumBarelySatisfied, NumNotSatisfied, totalResponses]);
        console.log("saved!")
    } catch(error){
        console.log("error saving tuple", error)
    }
        
        
};
module.exports = {
    getCourseDetails,
    saveIndirectAssessmentData
}

