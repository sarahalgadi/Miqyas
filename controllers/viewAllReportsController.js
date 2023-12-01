const sectionReportModel = require('../models/sectionReport');
const userModel = require('../models/UserModel');
const courseModel = require('../models/courseModel');
const courseReportModel = require('../models/courseReport');

async function viewReports(req,res){ 
    const {department, term} = req.params;
    const user = req.session.user;
    const instructorSectionReports = await sectionReportModel.getSectionReportCourses(user.username);
    const userRoles = await userModel.getUserRoles(user.username, term);
    const departmentCourseReports = await  courseReportModel.getCoursesWithReports(department);
    const departmentSectionReports = await sectionReportModel.getDepartmentSectionReports(department);
    res.render('view-reports', {title:'View Reports',user, userRoles, instructorSectionReports, departmentCourseReports, departmentSectionReports})
}





module.exports = {viewReports}