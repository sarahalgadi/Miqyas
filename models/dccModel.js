const pool = require('../database');



//get courses and their names under dcc's department
async function getDepartmentCourses (department, semester){

    const sql = 'SELECT DISTINCT c.courseCode, c.courseName FROM course c JOIN course_section co ON c.courseCode = co.courseCode WHERE c.department= ? AND co.semester = ? ';
    try {
        const [result] = await pool.execute(sql, [department, semester]);
        return result;
    } catch (error) {
        console.error('error getting department courses', error);
        throw error;
    }
    
}

//fetching the CLO info for retrieval for dcc only.
async function getCLOs (courseCode, semester){
    const [rows] = await pool.execute
    ('SELECT CLONumber, statement, domain FROM course_learning_outcomes WHERE courseCode = ? AND semester = ?', [courseCode, semester]);
    return rows;
}


// saving clos.
async function addCLOs (CLONumber, statement, domain ,courseCode, semester){

    try{
        await pool.execute
        ('INSERT INTO course_learning_outcomes (CLONumber, statement, domain ,courseCode ,semester) VALUES (?,?,?,?, ?) ON DUPLICATE KEY UPDATE statement = VALUES(statement) , domain = VALUES(domain)', [CLONumber, statement, domain ,courseCode, semester]);
    } catch(error){
        console.error('error saving clos', error);
        throw error;
    }
   
   }


//deleting clos
async function deleteCLOs(CLONumber, courseCode, semester){
    
    try{
        await pool.execute
        ('DELETE FROM course_learning_outcomes WHERE CLONumber = ? AND courseCode = ? AND semester = ?', [CLONumber, courseCode, semester]);
    } catch(error){
        console.error('error deleting clos', error);
        throw error;
    }
}


module.exports ={ getDepartmentCourses ,addCLOs, getCLOs, deleteCLOs};