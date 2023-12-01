const chairModel = require('../models/chairpersonModel.js');

//gets names and usernames
async function getFacultyFromDepartment (req,res) {
  const department = req.params.department;
  const semester = req.params.term; 
  try{
    const facultyNames = await chairModel.getFullNameDepartment(department);
    res.render('roleAssign',{facultyNames, department, semester})
  } catch(error){
    console.error(error);
    res.render('error', {message: "department faculty not found!"});
  }
};

async function saveRoles(req, res){
  const semester= req.params.term;
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
  const semester = req.params.term;
  const department = req.params.department;
  const college = req.params.college;
  const formData = req.body;
  console.log("form data ", formData);
  
  let usernames = formData.username;
  let courses = formData.course;

  //make sur eits array
  usernames = Array.isArray(usernames) ? usernames : [usernames];
  courses = Array.isArray(courses) ? courses : [courses];

  for (let i = 0; i < usernames.length; i++) {
    const username = usernames[i];
    const course = courses[i];
    const role = "coordinator";
  try{
    await chairModel.addCoordinatorRole(course,username,semester);
    await chairModel.addRoles(username,role,semester);
    res.send('<script>alert("Successfully saved the roles!"); window.location.href = "/view-faculty-college/' + college + '/' + department + '/' + semester + '";</script>');


  }catch(error){
    console.error(error);
    res.render('error', {message: "course not found!"});
  }

}};



module.exports = {
    getFacultyFromDepartment, saveRoles, getFacultyFromCollege,saveCoordinators,
}