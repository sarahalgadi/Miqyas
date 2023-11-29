const express = require('express');
const router = express.Router();
const courseInstructorController = require('../controllers/courseInstructor');
const authMiddleware = require('../middleware/authMiddleware')


router.get('/getAssessmentTypes/:courseCode/:term/:section', courseInstructorController.getGradesPage);
router.get('/directAssessmentResults/:courseCode/:term/:section', courseInstructorController.getDirectAssessmentResults);
router.get('/directAssessmentResults/:courseCode/:term/:section/:department', courseInstructorController.getDirectAssessmentResultsDepartment);
router.post('/submit-students/:courseCode/:term/:section', [authMiddleware],courseInstructorController.saveStudentActivities);
router.post('/assign-grades/:courseCode/:term/:section', [authMiddleware],courseInstructorController.assignGrades);
router.post('/saveAssessment/:courseCode/:term/:section', [authMiddleware], courseInstructorController.saveGrades);
router.get('/assign-grades/:courseCode/:term/:section', [authMiddleware],courseInstructorController.assignGrades);
router.get('/input-grades/:courseCode/:term/:section', [authMiddleware],courseInstructorController.inputGrades);

module.exports = router;