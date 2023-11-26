const express = require('express');
const router = express.Router();
const courseInstructorController = require('../controllers/courseInstructor');


router.get('/getAssessmentTypes/:courseCode/:term/:section', courseInstructorController.getGradesPage);
router.get('/directAssessmentResults/:courseCode/:term/:section', courseInstructorController.getDirectAssessmentResults);
router.get('/directAssessmentResults/:courseCode/:term/:section/:department', courseInstructorController.getDirectAssessmentResultsDepartment);
module.exports = router;