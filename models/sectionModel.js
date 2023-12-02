const pool = require('../database');

//----------------SECTION----------------------------------------------------
//assessment per section related queries

async function saveAssessmentDetails(courseCode, assessmentNumber, statment, grade, CLONumber, semester, type, sectionNumber) {
    const sql = `
        INSERT INTO assessment_details (coursecode, assessmentNumber, statment, grade, CLONumber, semester, type, sectionNumber)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        statment = VALUES(statment),
        grade = VALUES(grade)
    `;

    try {
        const [result] = await pool.execute(sql, [courseCode, assessmentNumber, statment, grade, CLONumber, semester, type, sectionNumber]);
        return result;
    } catch (error) {
        console.error('Error saving assessment details:', error);
        throw error;
    }
}


async function getAssessmentDetails(courseCode, semester, section){
    const sql=`SELECT assessmentNumber, CLONumber, statment, grade, type FROM assessment_details WHERE courseCode = ? AND semester = ? AND sectionNumber = ?`;

    try{
        const[result] = await pool.execute(sql, [courseCode, semester, section]);
        return result;
    } catch(error){
        console.error('error fetching details', error);
        throw error;
    }

}

//returns {grade: } 
//// im getting total here.. for the assessment Number..
async function getTotalWeightOfAQuestion(courseCode, semester, section, type, assessmentNumber){
    const sql = 'SELECT grade FROM assessment_details WHERE courseCode = ? AND semester = ? AND sectionNumber = ? AND type = ? AND assessmentNumber = ?';
    try{
        const[result] = await pool.execute(sql, [courseCode, semester, section, type, assessmentNumber]);
        return result[0];
    } catch(error){
        console.error('error fetching details', error);
        throw error;
    }

}


//function to save indirect assessment into db
async function saveIndirectAssessmentData(CLONumber, courseCode, semester, sectionNumber, NumFullySatisfied, NumAdequatelySatisfied, NumSatisfied, NumBarelySatisfied, NumNotSatisfied) {
    const first_query = `
    INSERT INTO indirect_assessment (
        CLONumber, courseCode, semester, sectionNumber, 
        NumFullySatisfied, NumAdequatelySatisfied, NumSatisfied,
        NumBarelySatisfied, NumNotSatisfied
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE 
        NumFullySatisfied = VALUES(NumFullySatisfied),
        NumAdequatelySatisfied = VALUES(NumAdequatelySatisfied),
        NumSatisfied = VALUES(NumSatisfied),
        NumBarelySatisfied = VALUES(NumBarelySatisfied),
        NumNotSatisfied = VALUES(NumNotSatisfied)
    `;
    
try{
    const [rows] = await pool.execute(first_query, [CLONumber, courseCode, semester, sectionNumber, NumFullySatisfied, NumAdequatelySatisfied, NumSatisfied, NumBarelySatisfied, NumNotSatisfied]);
    console.log("saved!")
} catch(error){
    console.log("error saving tuple", error)
}
}



module.exports = {

    saveAssessmentDetails,
    getAssessmentDetails,
    getTotalWeightOfAQuestion,
    saveIndirectAssessmentData
    
}