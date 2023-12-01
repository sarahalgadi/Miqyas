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
    
}

//getting faulty name and useranme in the college FOR COORDINATOR

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
    
}

async function getCurrentCoordinator (department){
    const [rows, fields] = await pool.execute
    ('SELECT f.fullName, co.username, r.role, co.courseCode FROM coordinator co JOIN faculty_role r ON co.username = r.username JOIN faculty f ON r.username = f.username JOIN course c ON co.courseCode = c.courseCode WHERE c.department = ?',[department]);
    return rows;
}

async function getCurrentRoles (department){
    const [rows, fields] = await pool.execute
    ('SELECT f.fullName, f.username, r.role FROM faculty f JOIN faculty_role r ON f.username = r.username  WHERE f.department = ? ',[department]);
    return rows;
}

async function deleteFacultyRole(username, role) { 
  
    const sqlDelete = `
      DELETE FROM faculty_role
      WHERE username = ? AND role= ? ;
    `;
    
    await pool.execute(sqlDelete, [ username, role]);
   
  }

  async function deleteCoordinator(courseCode, username, semester) { 
  
    const sqlDelete = `
      DELETE FROM coordinator
      WHERE courseCode = ? AND semester = ?;
    `;
    await pool.execute(sqlDelete, [ courseCode, semester]);
   
  }


module.exports ={getFullNameDepartment,getDepartment,addRoles,getFullNameCollege,addCoordinatorRole, getCourseCode,getCurrentCoordinator,getCurrentRoles,deleteFacultyRole, deleteCoordinator};