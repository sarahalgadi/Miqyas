const courseInstructorModel = require('../models/courseInstructor');

async function getGradesPage(req, res) {
    const { courseCode, term, section } = req.params;

    try {
        const directAssessment = await courseInstructorModel.getDirectAssessmentTypes(courseCode, term);
        const activities = directAssessment.map(item => item.type); // Extract just the activity names
        // Extract the courseName 
        const courseName = directAssessment.length > 0 ? directAssessment[0].coursename : '';

        const assignedWeights = {};
        directAssessment.forEach(tuple => {
            const type = tuple.type;

        });
        // Pass the retrieved data to the EJS file
        res.render('addQuestions', { title: 'Direct Assessment', activities, courseCode, term, courseName});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching data');
    }
}

async function saveAssessment(req, res) {
    try {
        const { courseCode, term} = req.params; 
        const { QNumber, description, weight, cloMapped, activity } = req.body; // Form fields corresponding to assessment details

        // Assuming 'grade' and 'sectionNumber' are not being saved yet, if needed, adjust accordingly

        await courseInstructorModel.saveAssessmentDetailsToDatabase(
            courseCode,
            QNumber,
            description,
            weight,
            cloMapped,
            term,
            activity
        );

        res.send('Assessment details saved successfully!');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error saving assessment details');
    }
}

module.exports = {
    getGradesPage,
    saveAssessment
}
