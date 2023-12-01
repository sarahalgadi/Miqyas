const userModel = require('../models/UserModel')

async function getUser(req,res ){
    
    const user= req.session.user;
    const term = await userModel.getCurrentTerm(user.username);
    const userRoles = await userModel.getUserRoles(user.username, term);
    const coordinatedCourses = await userModel.getCoordinatedCourses(user.username, term);
    const userCollege = await userModel.getUserCollege(user.department);

    console.log("username", user.username)
    console.log("term", term)
    const fullName = user.fullName;
    const title = "Miqyas: Home";
    const courses = await userModel.getCourses(user.username, term);

    console.log(courses);
    console.log("coordinated courses", coordinatedCourses);
    console.log("user roles", userRoles);
    
    console.log("lolgetuser", user)
    res.render('home', {user, title, fullName, term, courses, userRoles, coordinatedCourses, userCollege});
}

async function getAssessmentPerSection (req, res){
  //this is to get the page that shows direct, indirect, generate.
  const {courseCode, term, section} = req.params;
  const courseName = req.body.courseName;
  console.log("cname", courseName)

  res.render('assessmentSection', {title: 'Direct Assessment',courseCode, term, section, courseName});
}

async function viewReports(req,res){
  res.render('view-reports')
}




  module.exports = {getUser, getAssessmentPerSection, viewReports};
  