const courseInstructorModel = require('../model/courseInstructor');

async function renderCourseDetails(req, res) {
    const courseCode = req.params.courseCode;

    try {
        const courseInfo = await courseInstructorModel.getCourseDetails(courseCode);

        if (courseInfo) {
            const { section, term, courseName } = courseInfo;

            res.render('indirectAssessment', { title: 'Indirect Assessment', courseCode, section, term, courseName });

        } else {
            res.status(404).send('Course not found');
        }
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}

//----------Saving function is successful, but the actual data isn't being stored.. --
async function saveIndirectAssessment(req, res) {
    const {
        CLONumber,
        courseCode,
        semester,
        sectionNumber,
        NumFullySatisfied,
        NumAdequatelySatisfied,
        NumSatisfied,
        NumBarelySatisfied,
        NumNotSatisfied,
        totalResponses
    } = req.body;

    try {
        await courseInstructorModel.saveIndirectAssessmentData(
            CLONumber,
            courseCode,
            semester,
            sectionNumber,
            NumFullySatisfied,
            NumAdequatelySatisfied,
            NumSatisfied,
            NumBarelySatisfied,
            NumNotSatisfied,
            totalResponses
        );

        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
}
module.exports = {
    renderCourseDetails,
    saveIndirectAssessment
};
