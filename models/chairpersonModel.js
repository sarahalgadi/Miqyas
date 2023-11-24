const pool = require('../database');

//getting faulty name in the department
async function getFullNameDepartment ( department){
    const [rows, fields] = await pool.execute
    ('SELECT fullname FROM faculty WHERE department= ?');
    return rows;
}

//getting faulty usernames from department
async function getUsernamesDepartment ( department){
    const [rows, fields] = await pool.execute
    ('SELECT username FROM faculty WHERE  department= ?');
    return rows;
}

//get department name 
async function getDepartment (username){
    const [rows, fields] = await pool.execute
    ('SELECT department FROM faculty WHERE username = ? ');
    return rows;
}

async function addRoles ( semester){
    const [rows, fields] = await pool.execute
    ('INSERT INTO faculty_role (username, role, semester) VALUES (?,?,?) ON DUPLICATE KEY UPDATE role = VALUES(role)');
    return rows;
    //I dont know what to return if i am inserting into the databse
}

//getting faulty name in the college FOR COORDINATOR
// i think its  wrong needs to be revised
async function getFullNameCollege ( college ){
    const [rows, fields] = await pool.execute
    ('SELECT f.fullname FROM faculty f JOIN department d ON f.department = d.departmentName WHERE d.college = ?');
    return rows;
}

//getting faulty usernames college
async function getUsernamesCollege ( college){
    const [rows, fields] = await pool.execute
    ('SELECT f.username FROM faculty f JOIN department d ON f.department = d.departmentName WHERE d.college = ?');
    return rows;
}

async function addCoordinatorRole ( semester){
    const [rows, fields] = await pool.execute
    ('INSERT INTO coordinator (courseCode, username, semester) VALUES (?,?,?) ON DUPLICATE KEY UPDATE role = VALUES(role)');
    return rows;
    //I dont know what to return if i am inserting into the databse
}

module.exports ={getFullNameDepartment, getUsernamesDepartment,getDepartment,addRoles,getFullNameCollege,addCoordinatorRole,getUsernamesCollege };
