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
async function getDepartmentCourses (department, semester){
    //get coursecode/name under department from course table
    //get coursecode under semester from coordinator OR courseSection 
    //make the query 
    //return should be coursecode course name 
    const sql = 'SELECT c.courseCode, c.courseName FROM course c JOIN coordinator co ON c.courseCode = co.courseCode WHERE c.department= ? AND co.semester = ? ';
    try {
        const [result] = await pool.execute(sql, [department, semester]);
        return result;
    } catch (error) {
        console.error('error getting department courses', error);
        throw error;
    }
    
}
async function getCLOs (courseCode, semester){
    const [rows, fields] = await pool.execute
    ('SELECT CLONumber, statement, domain FROM course_learning_outcomes (CLONumber, statement, domain ,courseCode ,semester) VALUES (?,?,?,?, ?) ON DUPLICATE KEY UPDATE statment = VALUES(statment) , domain = VALUES(domain)');
    return rows;
    //I dont know what to return if i am inserting into the databse
}
async function addCLOs (CLONumber, statement, domain ,courseCode, semester){
    const [rows, fields] = await pool.execute
    ('INSERT INTO course_learning_outcomes (CLONumber, statement, domain ,courseCode ,semester) VALUES (?,?,?,?, ?) ON DUPLICATE KEY UPDATE statment = VALUES(statment) , domain = VALUES(domain)');
    return rows;
    //I dont know what to return if i am inserting into the databse
}



module.exports ={getSemesters, getDepartmentCourses ,addCLOs,getFullName, getDepartment};