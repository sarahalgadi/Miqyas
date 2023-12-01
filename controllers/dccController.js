const dccModel = require('../models/dccModel');

//the page where users add clos for a list of courses
async function editCLOs (req,res){
    const {department, term} = req.params;
    try{
        const courses = await dccModel.getDepartmentCourses(department, term);
        res.render('dcc', {title:'DCC: Edit CLO', courses, term, department});
    }catch(error){
        res.render('error', {message: "Error: Could not retrieve courses."})
    }
}

//saving CLOs in the modal
async function saveCLOs(req,res){
    const {courseCode, term} = req.params;
    const formData = req.body;
    const user = req.session.user;
    const department = user.department;
   

    try{
        const arrayLength = formData.cloNumber.length;
        for (let i = 0; i < arrayLength; i++) {
            const cloNumber = formData.cloNumber[i];
            const domain = formData.domain[i];
            let description = formData.description[i];
            if(description == '')
                description = "no CLO statement was given"
            await dccModel.addCLOs(cloNumber, description, domain, courseCode, term);
    
    }
    res.send('<script>alert("Successfully saved!"); window.location.href = "/edit-clos/' + department + '/' + term + '";</script>');
    } catch(error){
        res.render('error', {message: "Error: Could not save course learning outcomes.. please try again."})
    }
}

//this returns json.. it's for retrieving clos for dcc.. if they were saved before.. etc.
async function getCLOs(req, res){
    const {courseCode, term} = req.params;
    try {
        const clos = await dccModel.getCLOs(courseCode, term);
        console.log("clo json: ", clos);
        res.json(clos);
    } catch (error) {
        console.error('Error fetching CLOs:', error);
        res.render('error', {message: "Error: Could not fetch CLOs."})
    }
}

module.exports = {editCLOs, saveCLOs, getCLOs}