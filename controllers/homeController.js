const userModel = require('../models/UserModel')
const sectionReportModel = require('../models/sectionReportModel');
const courseReportModel = require('../models/courseReportModel');

async function getUser(req,res ){
    
    const user= req.session.user;
    try{
      const term = await userModel.getCurrentTerm(user.username);
      const userRoles = await userModel.getUserRoles(user.username, term);
      const coordinatedCourses = await userModel.getCoordinatedCourses(user.username, term);
      const userCollege = await userModel.getUserCollege(user.department);
      const title = "Miqyas: Home";
      const courses = await userModel.getCourses(user.username, term);
      res.render('home', {user, title, term, courses, userRoles, coordinatedCourses, userCollege});
    } catch(error){
      res.render('error', {message: "Error: Could not load home page!"})
    }

}

//this redirects from the home page to the section selected via the section card (aka show direct, indirect, prepare)
async function getAssessmentPerSection (req, res){
  const {courseCode, term, section} = req.params;
  const courseName = req.body.courseName;

  res.render('assessmentSection', {title: 'Direct Assessment',courseCode, term, section, courseName});
}


//clicking on the button to take u to the past reports
async function viewReports(req,res){ 
  const {department, term} = req.params;
  const user = req.session.user;
  try{
    const instructorSectionReports = await sectionReportModel.getSectionReportCourses(user.username);
    const userRoles = await userModel.getUserRoles(user.username, term);
    const departmentCourseReports = await  courseReportModel.getCoursesWithReports(department);
    const departmentSectionReports = await sectionReportModel.getDepartmentSectionReports(department);
    res.render('view-reports', {title:'View Reports',user, userRoles, instructorSectionReports, departmentCourseReports, departmentSectionReports})
  }catch(error){
    res.render('error', {message: "Error: Could not retrieve past reports!"})
  }
}
 

module.exports = {getUser, getAssessmentPerSection, viewReports};
  