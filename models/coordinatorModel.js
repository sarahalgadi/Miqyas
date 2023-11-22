
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'miqyas',
  waitForConnection: true,
  connectionLimit: 10,
  queueLimit: 0
});

//Repeated code from DCC Model
//coordinator name 
async function getFullName (username){
    const [rows, fields] = await pool.execute
    ('SELECT fullname FROM faculty WHERE username = ? ');
    return rows;
}

//courses cc is teaching 
async function coursesTeaching (username){
    const [rows, fields] = await pool.execute
    ('SELECT c.courseCode, c.courseName, cs.sectionNumber FROM course_section cs JOIN course c ON c.courseCode = cs.courseCode WHERE cs.username = ?');
    return rows;
}

//courses cc is coordinating 
async function coursesCoordinating(username){
    const [rows, fields] = await pool.execute
    ('SELECT c.courseCode, c.courseName FROM coordinator co JOIN course c ON c.courseCode = co.courseCode WHERE co.username = ?');
    return rows;
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//the semesters for a given course
//needs to be according to the course chosen
async function getSemester (courseCode){
    const [rows, fields] = await pool.execute
    ('SELECT semester FROM coordinator WHERE courseCode=?');
    return rows;
}

//action plans aka course section reports
async function getActionReports (courseCode,semester){
    const [rows, fields] = await pool.execute
    ('SELECT statement FROM action_plan WHERE courseCode=? AND semester=?');
    return rows;
}
//add the assessment type and weight
async function addTypeAndWeight (){
    const [rows, fields] = await pool.execute
    ('INSERT INTO direct_assessment (courseCode, type, weight, semester) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE weight, type = VALUES(weight, type) ');
    return rows;
    //I dont know what to return if i am inserting into the databse
}


//chnage the assesment type 
/* try using the add bdal el updates
async function updateAssessmentType (courseCode,semester){
    const [rows, fields] = await pool.execute
    ('UPDATE direct_assessment SET type = ? WHERE coursecode = ? AND semester = ?');
    return rows;
    //I dont know what to return if i am inserting into the databse
}*/ 

//get the assessment type
async function getAssessmentType (courseCode, semester){
    const [rows, fields] = await pool.execute
    ('SELECT type FROM direct_assessment WHERE courseCode=? AND semester=?');
    return rows;
}

//change the assessment weight 
/*async function updateAssessmentWeight (courseCode,semester){
    const [rows, fields] = await pool.execute
    ('UPDATE direct_assessment SET weight = ? WHERE coursecode = ? AND semester = ?');
    return rows;
    //I dont know what to return if i am inserting into the databse
}*/ 
//getting the assessment weight
async function getAssessmentWeight (courseCode, semester){
    const [rows, fields] = await pool.execute
    ('SELECT weight FROM direct_assessment WHERE courseCode=? AND semester=?');
    return rows;
}
module.exports ={getSemester,getActionReports, 
     getAssessmentType,getAssessmentWeight, addTypeAndWeight,
     getFullName, coursesTeaching, coursesCoordinating};







