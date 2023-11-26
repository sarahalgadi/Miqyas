const express = require('express');
const router = express.Router();
const courseInstructorController = require('../controllers/courseInstructor');


router.get('/getAssessmentTypes/:courseCode/:term', courseInstructorController.getGradesPage);

module.exports = router;