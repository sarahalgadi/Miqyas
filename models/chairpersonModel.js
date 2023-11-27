const pool = require('../database');

//getting faulty name and username in the department
async function getFullNameDepartment ( department){
    const sql= 'SELECT fullName, username FROM faculty WHERE department = ?';
    try{
        const [rows] = await pool.execute(sql, [department]);
    return rows;
    }catch(error){
        console.log(error);
    }
    
}

//get department name 
async function getDepartment (username){
    const [rows, fields] = await pool.execute
    ('SELECT department FROM faculty WHERE username = ? ');
    return rows;
}

async function addRoles ( username, role, semester){
    const [rows, fields] = await pool.execute
    ('INSERT INTO faculty_role (username, role, semester) VALUES (?,?,?) ON DUPLICATE KEY UPDATE role = VALUES(role)',[username, role,semester]);
    return rows;
    //I dont know what to return if i am inserting into the databse
}

//getting faulty name and useranme in the college FOR COORDINATOR
// i think its  wrong needs to be revised
async function getFullNameCollege ( college ){
    const [rows, fields] = await pool.execute
    ('SELECT f.fullName,  f.username  FROM faculty f JOIN department d ON f.department = d.departmentName WHERE d.college = ?',[college]);
    return rows;
}

async function getCourseCode ( college ){
    const [rows, fields] = await pool.execute
    ('SELECT c.courseCode FROM course c  JOIN department d ON c.department = d.departmentName WHERE d.college = ?',[college]);
    return rows;
}

async function addCoordinatorRole ( courseCode, username,semester){
    const [rows, fields] = await pool.execute
    ('INSERT INTO coordinator (courseCode, username, semester) VALUES (?,?,?) ON DUPLICATE KEY UPDATE courseCode = VALUES(courseCode)',[courseCode,username,semester]);
    return rows;
    //I dont know what to return if i am inserting into the databse
}

module.exports ={getFullNameDepartment,getDepartment,addRoles,getFullNameCollege,addCoordinatorRole, getCourseCode };
