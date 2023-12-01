const pool = require('../database');
//todo: rename this to sectionModel
//todo: anything related to students moved to student model
//todo: orrrrrr split 
//---------------------------------
//to remove
//---------------------------------

async function getCourseName(courseCode) { //////todo: questionable..if it should be in course
    const sql = 'SELECT courseName FROM course WHERE courseCode = ?';
    const [rows] = await pool.execute(sql, [courseCode]);
    return rows.length > 0 ? rows[0].courseName : null;
  }


  async function getCLOInfo(courseCode, semester) { //todo: moved to course
    const sql = 'SELECT  clo.statement, clo.CLONumber FROM course_learning_outcomes clo WHERE clo.courseCode = ? AND clo.semester = ?';
    const [rows, fields] = await pool.execute(sql, [courseCode, semester]);
    const CLOstatements = rows.map(row => row.statement);
    const CLOnumbers = rows.map(row => row.CLONumber);
    return {CLOstatements, CLOnumbers };
  }

  

  
async function getDepartments() { /////////todo:moved to course..
    const sql = 'SELECT departmentName FROM department';
    const [rows] = await pool.execute(sql);
    const departmentNames = rows.map(row => row.departmentName);
    return departmentNames;
  }



//-------


//assessment per section related queries
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

//keep it here
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
async function getTotalWeightOfAQuestion(courseCode, semester, section, type, assessmentNumber){// im getting total here.. for the assessment umber..
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


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//student-related queries

async function getStudentInfo(courseCode, term, section) { //todo: moved to student info.
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

async function getDirectPerCLOPerStudent(courseCode, term, section) { //todo moved to student
    const sql = `
        SELECT
            sd.studentID,
            ad.CLONumber,
            AVG(sd.CLOAchievmentPerQuestion / 100) AS averageCloAchievement
        FROM
            student_direct_assessment sd
            JOIN assessment_details ad ON sd.type = ad.type
                AND sd.assessmentNumber = ad.assessmentNumber
                AND sd.courseCode = ad.courseCode
                AND sd.semester = ad.semester
                AND sd.sectionNumber = ad.sectionNumber
        WHERE
            sd.courseCode = ?
            AND sd.semester = ?
            AND sd.studentID IN (
                SELECT DISTINCT s.studentID
                FROM student s
                INNER JOIN student_coursesection cs ON s.studentID = cs.studentID
                WHERE cs.courseCode = ? AND cs.semester = ? AND cs.sectionNumber = ?
            )
        GROUP BY
            sd.studentID, ad.CLONumber
        ORDER BY
            sd.studentID; 
    `;
    try {
        const [rows] = await pool.execute(sql, [courseCode, term, courseCode, term, section]);
        return rows;
    } catch (error) {
        console.error('Error fetching student information:', error);
        throw error;
    }
}

async function getDirectPerCLOPerStudentDepartment(courseCode, term, section, department) { //todo: moved to student
    const sql = `
        SELECT
            sd.studentID,
            ad.CLONumber,
            AVG(sd.CLOAchievmentPerQuestion / 100) AS averageCloAchievement
        FROM
            student_direct_assessment sd
            JOIN assessment_details ad ON sd.type = ad.type
                AND sd.assessmentNumber = ad.assessmentNumber
                AND sd.courseCode = ad.courseCode
                AND sd.semester = ad.semester
                AND sd.sectionNumber = ad.sectionNumber
        WHERE
            sd.courseCode = ?
            AND sd.semester = ?
            AND sd.studentID IN (
                SELECT DISTINCT s.studentID
                FROM student s
                INNER JOIN student_coursesection cs ON s.studentID = cs.studentID
                WHERE cs.courseCode = ? AND cs.semester = ? AND cs.sectionNumber = ?
                    AND s.department = ?  
            )
        GROUP BY
            sd.studentID, ad.CLONumber;
    `;
    try {
        const [rows] = await pool.execute(sql, [courseCode, term, courseCode, term, section, department]);
        return rows;
    } catch (error) {
        console.error('Error fetching student information:', error);
        throw error;
    }
}



async function saveStudentCategories(courseCode, semester, sectionNumber, studentID, CLONumber, studentCLOPercentage, category){//todo: moved to student
    const sql = `
    INSERT INTO student_coursesection 
    (courseCode, semester, sectionNumber, studentID, CLONumber, studentCLOPercentage, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    studentCLOPercentage = VALUES(studentCLOPercentage),
    category = VALUES(category)
`;
    try{
        const [rows] = await pool.execute(sql, [courseCode, semester, sectionNumber, studentID, CLONumber, studentCLOPercentage, category]);
        console.log("saved!")
    } catch(error){
        console.log("error saving tuple", error)
    }

}

//keep it here
  

async function saveStudentAveragePerQuestion(type, courseCode, assessmentNumber, studentID, studentGrade, CLOAchievmentPerQuestion, semester, sectionNumber){
    const sql = `INSERT INTO student_direct_assessment (type, courseCode, assessmentNumber, studentID, studentGrade, CLOAchievmentPerQuestion, semester, sectionNumber) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    studentGrade = VALUES(studentGrade),
    CLOAchievmentPerQuestion = VALUES(CLOAchievmentPerQuestion)`;

    try{
        const[result] = await pool.execute(sql, [type, courseCode, assessmentNumber, studentID, studentGrade, CLOAchievmentPerQuestion, semester, sectionNumber]);

    } catch(error){
        console.log("error saving grades", error)
    }
}

async function getStudentGrades(courseCode, semester, sectionNumber){//functino to see if student have grades saved first..
    const sql = `SELECT * FROM student_direct_assessment WHERE courseCode = ? AND semester = ? AND sectionNumber = ?`;
    try{
        const[result] = await pool.execute(sql, [courseCode,semester, sectionNumber]);
        return result;

    } catch(error){
        console.log("error saving grades", error)
    }
}


module.exports = {
    getDirectAssessmentTypes,
    getStudentInfo,
    getDirectPerCLOPerStudent,
    getCLOInfo,
    getCourseName,
    getDepartments,
    getDirectPerCLOPerStudentDepartment,
    saveStudentCategories,
    getCLOInfo,
    saveAssessmentDetails,
    getAssessmentDetails,
    getTotalWeightOfAQuestion,
    saveStudentAveragePerQuestion, //saving grades for each student and clo achievement percentage
    getStudentGrades, //this is used in inputting grades page so in case there were readily made ones we view them
    saveIndirectAssessmentData
}