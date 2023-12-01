const chairModel = require('../models/chairpersonModel.js');

//gets names and usernames
async function getFacultyFromDepartment (req,res) {
  const department = req.params.department;
  const semester = req.params.term; 
  try{
    const facultyNames = await chairModel.getFullNameDepartment(department);
    const roles = await chairModel.getCurrentRoles(department);
    res.render('roleAssign',{facultyNames, department, semester, roles})
  } catch(error){
    console.error(error);
    res.render('error', {message: "course not found!"});
  }
};

async function deleteRole (req,res) {
  console.log("i am here")
  const useranme = req.body.username;
  const role = req.body.role; 
  const semester = req.params.semester;
  console.log(useranme,role,semester)
  try{
    await chairModel.deleteRole(useranme,role,semester);
    res.render('index')
  } catch(error){
    console.error(error);
    res.render('error', {message: "didnt work lol"});
  }
};

async function saveRoles(req, res){
  const{semester}= req.params;
  const roles = req.body;  
  
  try{
    let dcc = roles["department curriculum committee"];
    if(dcc){

      dcc = Array.isArray(dcc) ? dcc : [dcc];
      for (let i = 0; i < dcc.length; i++) {
      const username = dcc[i];
      await chairModel.addRoles(username,"DCC", semester);  
    }   
  }
  let qa = roles["quality assurance"];
  if(qa){ 
    qa = Array.isArray(qa) ? qa : [qa];
    for (let i = 0; i < qa.length; i++) {
    const username = qa[i];
    await chairModel.addRoles(username,"QA", semester);  
  }
  }}catch(error){
    console.error(error);
    res.render('error', {message: "course not found!"});
  }
};



//------------------------------------------------------------------------------------------------------------------------------------------


//for coordinator stuff


//will get name and username
async function getFacultyFromCollege(req,res) {
  let college = req.params.college;
  const semester = req.params.term;
  const department = req.params.department;
  try{

  const names = await chairModel.getFullNameCollege(college);
  const courses= await chairModel.getCourseCode(college);
  const coordinator = await chairModel.getCurrentCoordinator(department);//for the first table

  res.render('assignCoordinator', {names, college, courses, semester, department, coordinator});
  } catch(error){
    console.error(error);
    res.render('error', {message: "course not found!"});
  }
};

async function saveCoordinators(req, res){
  const semester = req.params.semester;
  const formData = req.body;
 
  
  const usernames = formData.username;
  const courses = formData.course;

  for (let i = 0; i < usernames.length; i++) {
    const username = usernames[i];
    const course = courses[i];
    const role = "coordinator";
  try{
    await chairModel.addCoordinatorRole(course,username,semester);// in coordinator table
    await chairModel.addRoles(username,role,semester);//in faculty_role table
  }catch(error){
    console.error(error);
    res.render('error', {message: "course not found!"});
  }

}};




module.exports = {
    getFacultyFromDepartment, saveRoles, getFacultyFromCollege,saveCoordinators,deleteRole
}