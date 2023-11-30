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

async function saveIndirectAssessment(req, res) {
        const formData =req.body;
        const CLONumber = formData['CLONumber'];
        const courseCode = formData['courseCode'];
        const semester = formData['semester'];
        const sectionNumber = formData['sectionNumber'];
        const NumFullySatisfied = formData['NumFullySatisfied'];
        const NumAdequatelySatisfied = formData['NumAdequatelySatisfied'];
        const NumSatisfied = formData['NumSatisfied'];
        const NumBarelySatisfied = formData['NumBarelySatisfied'];
        const NumNotSatisfied =formData['NumNotSatisfied'];

    try {
        console.log("formdata", req.body);
        for(let i=0; i< CLONumber.length; i++){
            const CLO = parseInt(CLONumber[i]);
            const full = parseInt(NumFullySatisfied[i]);
            const adequate = parseInt(NumAdequatelySatisfied[i]);
            const satisfied = parseInt(NumSatisfied[i]);
            const barely = parseInt(NumBarelySatisfied[i]);
            const not = parseInt(NumNotSatisfied[i]);

            await courseInstructorModel.saveIndirectAssessmentData(CLO, courseCode, semester, sectionNumber, full, adequate, satisfied, barely, not);
        }

        await courseInstructorModel.saveIndirectAssessmentData(
            CLONumber,
            courseCode,
            semester,
            sectionNumber,
            NumFullySatisfied,
            NumAdequatelySatisfied,
            NumSatisfied,
            NumBarelySatisfied,
            NumNotSatisfied
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
