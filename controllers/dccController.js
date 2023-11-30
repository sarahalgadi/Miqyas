const dccModel = require('../models/dccModel');

async function editCLOs (req,res){
    const {department, term} = req.params;

    const courses = await dccModel.getDepartmentCourses(department, term);

    res.render('dcc', {title:'DCC: Edit CLO', courses, term, department});
}
async function saveCLOs(req,res){
    console.log(req.body)
}

module.exports = {editCLOs, saveCLOs}