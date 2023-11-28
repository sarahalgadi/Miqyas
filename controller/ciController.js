const courseInstructorModel = require('../models/courseInstructor');

async function getGradesPage(req, res) {
    const { courseCode, term, section } = req.params;

    try {
        const directAssessment = await courseInstructorModel.getDirectAssessmentTypes(courseCode, term);
        const assignedWeights = {};
        directAssessment.forEach(tuple => {
            const type = tuple.type;
            const weight = tuple.weight;
            assignedWeights[type] = weight;
        });

        const studentInfo = await courseInstructorModel.getStudentInfo(courseCode, term, section);
        
        // Pass the retrieved data to the EJS file
        res.render('addQuestions', {
            title: 'Direct Assessment',
            activities: directAssessment, // This will be used in the EJS file for activities
            assignedWeights,
            studentInfo
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching data');
    }
}

module.exports = {
    getGradesPage
}
