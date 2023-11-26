const express = require('express');
const router = express.Router();
const courseInstructorController = require('../controllers/courseInstructor');


router.get('/getAssessmentTypes/:courseCode/:term/:section', courseInstructorController.getGradesPage);

module.exports = router;