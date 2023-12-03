const pool = require('../database');


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


//get direct assessment average achievement per clo for each student
async function getDirectPerCLOPerStudent(courseCode, term, section) { 
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



//get direct per clo per student when we filter using their program/major/department
async function getDirectPerCLOPerStudentDepartment(courseCode, term, section, department) {
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


//saving into student_coursesection table the CLO achievement as well as the computed categories
//this data will then be retrieved for section report calculation
async function saveStudentCategories(courseCode, semester, sectionNumber, studentID, CLONumber, studentCLOPercentage, category){
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

//saving student's per question grade.
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


//function to retrieve student grades if they exist.... to fill the table.
async function getStudentGrades(courseCode, semester, sectionNumber){
    const sql = `SELECT * FROM student_direct_assessment WHERE courseCode = ? AND semester = ? AND sectionNumber = ?`;
    try{
        const[result] = await pool.execute(sql, [courseCode,semester, sectionNumber]);
        return result;

    } catch(error){
        console.log("error saving grades", error)
    }
}



module.exports = {getStudentInfo, getDirectPerCLOPerStudent, getDirectPerCLOPerStudentDepartment, saveStudentCategories, saveStudentAveragePerQuestion, getStudentGrades}