const dccModel = require('../models/dccModel');

async function editCLOs (req,res){
    const {department, term} = req.params;

    const courses = await dccModel.getDepartmentCourses(department, term);

    res.render('dcc', {title:'DCC: Edit CLO', courses, term, department});
}
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
        res.render('error', {message: "Could not save course learning outcomes.. please enter again"})
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
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {editCLOs, saveCLOs, getCLOs}