const chairModel = require('../models/chairpersonModel.js');


async function getFacultyFromDepartment (req,res) {
  const department = encodeURIComponent(req.params.department);
  const semester = encodeURIComponent(req.params.semester);
  try{
    const facultyNames = await chairModel.getFullNameDepartment(department);
    const userNames = await chairModel.getUsernamesDepartment(department);
    res.render('roleAssign',{facultyNames, userNames, department, semester})
  } catch(error){
    console.error(error);
    res.render('error', {message: "course not found!"});
  }
};

async function saveRoles(req, res){
  const{department,semester,username}= req.params;
  const roles = req.body;  
  try{
    await chairModel.addRoles(username, roles, semester)
  }catch(error){
    console.error(error);
    res.render('error', {message: "course not found!"});
  }
};



/*async function getFacultyFromCollege(req,res) {
  const {college} = req.params;
  try{
  const names = await chairModel.getFullNameCollege(college);
  const usernames = await chairModel.getUsernamesCollege( college);
  res.render('assignCoordinator', {names, usernames});
  } catch(error){
    console.error(error);
    res.render('error', {message: "course not found!"});
  }
};*/ 


module.exports = {
    getFacultyFromDepartment, saveRoles
}