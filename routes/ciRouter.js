const express = require('express');
const router = express.Router();
const courseInstructorController = require('../controller/ciController');

//get the activities set for the course to input questions
router.get('/getAssessmentTypes/:courseCode/:term', courseInstructorController.getGradesPage);

// Route to handle saving assessment details
router.post('/saveAssessment/:courseCode/:term', courseInstructorController.saveAssessment);
module.exports = router;