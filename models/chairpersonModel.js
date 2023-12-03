const pool = require('../database');

//getting faulty name and username in the department
async function getFullNameDepartment (department){
    const sql= 'SELECT fullName, username FROM faculty WHERE department = ?';
    try{
        const [rows] = await pool.execute(sql, [department]);
    return rows;
    }catch(error){
        console.log(error);
    }
    
}


//so we update semester in faculty_role anytime username + role are duplicated. this is updated every semester by uni. to get current semester.
async function addRoles ( username, role, semester){
    const [rows, fields] = await pool.execute
    ('INSERT INTO faculty_role (username, role, semester) VALUES (?,?,?) ON DUPLICATE KEY UPDATE semester = VALUES(semester)',[username, role,semester]);
    return rows;
    
}

//getting faulty name and useranme in the college FOR COORDINATOR
async function getFullNameCollege (college){
    const [rows, fields] = await pool.execute
    ('SELECT f.fullName,  f.username  FROM faculty f JOIN department d ON f.department = d.departmentName WHERE d.college = ?',[college]);
    return rows;
}



async function addCoordinatorRole ( courseCode, username,semester){
    const [rows, fields] = await pool.execute
    ('INSERT INTO coordinator (courseCode, username, semester) VALUES (?,?,?) ON DUPLICATE KEY UPDATE username = VALUES(username)',[courseCode,username,semester]);
    return rows;
    
}

async function getCurrentCoordinator (department, semester){
    const [rows, fields] = await pool.execute
    ('SELECT f.fullName, co.courseCode, co.username FROM coordinator co JOIN faculty f ON co.username = f.username JOIN course c ON co.courseCode = c.courseCode WHERE c.department = ? AND co.semester = ? ',[department, semester]);
    return rows;
}

async function getCurrentRoles (department){
    const [rows, fields] = await pool.execute
    ('SELECT f.fullName, r.role FROM faculty f JOIN faculty_role r ON f.username = r.username  WHERE f.department = ? ',[department]);
    return rows;
}

async function deleteFacultyRole(username, role, semester) { 
  
    const sqlDelete = `
      DELETE FROM faculty_role
      WHERE username = ? AND role= ? AND semester = ? ;
    `;
    
    await pool.execute(sqlDelete, [ username, role, semester]);
   
  }

  async function deleteCoordinator(courseCode, username, semester) { 
  
    const sqlDelete = `
      DELETE FROM coordinator
      WHERE courseCode = ? AND semester = ? AND username = ?;
    `;
    await pool.execute(sqlDelete, [ courseCode, semester, username]);
   
  }


module.exports ={getFullNameDepartment,addRoles,getFullNameCollege,addCoordinatorRole,getCurrentCoordinator, getCurrentRoles, deleteCoordinator, deleteFacultyRole };