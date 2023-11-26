const courseInstructorModel = require('../models/courseInstructor');


async function getGradesPage(req, res) {
    const {courseCode, term, section} = req.params;

    const directAssessment = await courseInstructorModel.getDirectAssessmentTypes(courseCode, term);
    const assignedWeights = {};
    directAssessment.forEach(tuple => {
        const type = tuple.type;
        const weight = tuple.weight;
        assignedWeights[type] = weight;
    });

    const studentInfo = await courseInstructorModel.getStudentInfo(courseCode, term, section);

    res.render('instructor',  {assignedWeights, studentInfo});
}

module.exports = {
    getGradesPage
}