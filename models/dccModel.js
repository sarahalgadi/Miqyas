const pool = require('../database');


//all the semesters
async function getSemesters (){
    const [rows, fields] = await pool.execute
    ('SELECT DISTINCT semester FROM course_section ');
    return rows;
}

//DCC member name 
async function getFullName (username){
    const [rows, fields] = await pool.execute
    ('SELECT fullname FROM faculty WHERE username = ? ');
    return rows;
}

//department
async function getDepartment (username){
    const [rows, fields] = await pool.execute
    ('SELECT department FROM faculty WHERE username = ? ');
    return rows;
}

//get courses
async function getCourses (department, semester){
    const [rows, fields] = await pool.execute
    //get coursecode/name under department from course table
    //get coursecode under semester from coordinator OR courseSection 
    //make the query 
    //return should be coursecode course name 
    ('SELECT c.courseCode, c.courseName FROM course c JOIN coordinator co ON c.courseCode = co.courseCode WHERE c.department= ? AND co.semester = ? ');
    return rows;
}

async function addCLOs (CLONumber, statement, domain ,courseCode, semester){
    const [rows, fields] = await pool.execute
    ('INSERT INTO course_learning_outcomes (CLONumber, statement, domain ,courseCode ,semester) VALUES (?,?,?,?, ?) ON DUPLICATE KEY UPDATE statment = VALUES(statment) , domain = VALUES(domain)');
    return rows;
    //I dont know what to return if i am inserting into the databse
}

//chnage the CLO 
/*
async function updateCLO(CLONumber, courseCode,semester){
    const [rows, fields] = await pool.execute
    ('UPDATE course_learning_outcomes SET  statement = ?, domain = ?  WHERE CLONumber = ?,coursecode = ? AND semester = ?');
    return rows;
    //I dont know what to return if i am inserting into the databse
}
*/

//delete (this is wrong)
/* 
async function updateCLO(CLONumber, courseCode,semester){
    const [rows, fields] = await pool.execute
    ('DELETE course_learning_outcomes SET  statement = ?, domain = ?  WHERE CLONumber = ?,coursecode = ? AND semester = ?');
    return rows;
    //I dont know what to return if i am inserting into the databse
}*/ 

module.exports ={getSemesters, getCourses ,addCLOs,getFullName, getDepartment};