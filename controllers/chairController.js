const chairModel = require('../models/chairpersonModel.js');
const courseModel = require('../models/courseModel.js')
const userModel = require('../models/UserModel')


//gets names and usernames of department faculty members to give them roles (dcc & qa)
async function getFacultyFromDepartment (req,res) {
  const department = req.params.department;
  const semester = req.params.term; 
  const user = req.session.user;
  try{
    const userRoles = await userModel.getUserRoles(user.username, semester);
    const facultyNames = await chairModel.getFullNameDepartment(department);
    const roles = await chairModel.getCurrentRoles(department);
    res.render('roleAssign',{facultyNames, department, semester, roles, user, userRoles})
  } catch(error){
    console.error(error);
    res.render('error', {message: "department faculty not found!"});
  }
};

//saving those dcc and qa roles

async function saveRoles(req, res){
  const semester= req.params.term;
  const department = req.params.department;
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
  }     
  res.send('<script>alert("Successfully saved the roles!"); window.location.href = "/view-faculty-department/' + department + '/' + semester + '/'  + '";</script>');
}catch(error){
    console.error(error);
    res.render('error', {message: "Error: did not save roles, please try again."});
  }
};

async function deleteRole (req,res) {
  console.log("i am here")
  const useranme = req.body.username;
  const role = req.body.role; 
  console.log(useranme,role)

  //to render home..
  const user = req.session.user;
  const term = await userModel.getCurrentTerm(user.username);
  const userRoles = await userModel.getUserRoles(user.username, term);
  const coordinatedCourses = await userModel.getCoordinatedCourses(user.username, term);
  const userCollege = await userModel.getUserCollege(user.department);
  const title = "Miqyas: Home";
  const courses = await userModel.getCourses(user.username, term);
  try{
    await chairModel.deleteFacultyRole(useranme,role);
    res.render('home', {title, user, term, userRoles, coordinatedCourses, userCollege, courses})
  } catch(error){
    console.error(error);
    res.render('error', {message: "Error: Could not delete role."});
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------


//for coordinator stuff


//will get name and username of faculty college
async function getFacultyFromCollege(req,res) {
  let college = req.params.college;
  const semester = req.params.term;
  const department = req.params.department;
  const user = req.session.user;
  try{
  const userRoles = await userModel.getUserRoles(user.username, semester);
  const names = await chairModel.getFullNameCollege(college);
  const courses= await courseModel.getCourseCode(department);
  const coordinator = await chairModel.getCurrentCoordinator(department, semester);

  res.render('assignCoordinator', {names, college, courses, semester, department, coordinator, user, userRoles});
  } catch(error){
    console.error(error);
    res.render('error', {message: "Error: Could not retrieve college faculty members."});
  }
};

async function saveCoordinators(req, res){
  const semester = req.params.term;
  const department = req.params.department;
  const college = req.params.college;
  const formData = req.body;

  let usernames = formData.username;
  let courses = formData.course;


  //make sure its array
  usernames = Array.isArray(usernames) ? usernames : [usernames];
  courses = Array.isArray(courses) ? courses : [courses];

  
  
  if(courses.length < usernames.length){
    res.render('error', {message: "Error: You need to specify a course for the coordinator!"})
  }

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
    res.render('error', {message: "Error: Could not save coordinator roles!"});
  }

}};

async function deleteCoordinatorRole (req,res) {
  console.log("i am here pt2")
  const courseCode = req.body.courseCode;
  const username = req.body.usernameToDelete;
  const role = req.body.role; 
  const semester = req.params.semester;
  console.log(courseCode,username,role,semester)

  //to render home
  const user = req.session.user;
  const term = await userModel.getCurrentTerm(user.username);
  const userRoles = await userModel.getUserRoles(user.username, term);
  const coordinatedCourses = await userModel.getCoordinatedCourses(user.username, term);
  const userCollege = await userModel.getUserCollege(user.department);
  const title = "Miqyas: Home";
  const courses = await userModel.getCourses(user.username, term);

  try{
    await chairModel.deleteCoordinator(courseCode, username, semester)
    await chairModel.deleteFacultyRole(username,role, semester);
    res.render('home', {title, term, user, userRoles, coordinatedCourses, userCollege, courses})
  } catch(error){
    console.error(error);
    res.render('error', {message: "Error: Could not delete coordinator role."});
  }
};



module.exports = {
    getFacultyFromDepartment, saveRoles, getFacultyFromCollege,saveCoordinators,deleteCoordinatorRole, deleteRole
}