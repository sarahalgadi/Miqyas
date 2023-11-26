const courseInstructorModel = require('../models/courseInstructor');


async function getGradesPage(req, res) {
    const {courseCode, term} = req.params;

    const directAssessment = await courseInstructorModel.getDirectAssessmentTypes(courseCode, term);
    const assignedWeights = {};
    directAssessment.forEach(tuple => {
        const type = tuple.type;
        const weight = tuple.weight;
        assignedWeights[type] = weight;
    });

    res.render('instructor',  {assignedWeights});
}

module.exports = {
    getGradesPage
}