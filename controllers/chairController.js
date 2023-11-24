const chairModel = require('../models/chairpersonModel.js');


async function getFacultyFromDepartment (req,res) {
    const {department} = req.params;
    try{
    const names = await chairModel.getFullNameDepartment(department);
    const usernames = await chairModel.getUsernamesDepartment( department);
    res.render('roleAssign.ejs', {names, usernames});
    } catch(error){
      console.error(error);
      res.render('error', {message: "course not found!"});
    }
};

async function getFacultyFromCollege(req,res) {
  const {college} = req.params;
  try{
  const names = await chairModel.getFullNameCollege(college);
  const usernames = await chairModel.getUsernamesCollege( college);
  //need another page for this
  res.render('', {names, usernames});
  } catch(error){
    console.error(error);
    res.render('error', {message: "course not found!"});
  }
};

module.exports = {
    getFacultyFromDepartment, getFacultyFromCollege
}