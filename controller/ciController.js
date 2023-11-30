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

//----------DOES NOT WORK, TRY AGAIN bs tmw its 3 am rn and im so done -------
async function saveIndirectAssessment(req, res) {
    try {
        const { courseCode, semester, sectionNumber, totalResponses } = req.body;
        const multipleRowsData = req.body.multipleRowsData; // Assuming this is an array of row objects

        for (const rowData of multipleRowsData) {
            const indirectAssessmentData = {
                courseCode,
                semester,
                sectionNumber,
                totalResponses,
                ...rowData,
            };

            await courseInstructorModel.saveIndirectAssessmentData(indirectAssessmentData);
        }

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
