const express = require('express');
const router = express.Router();
const courseInstructorController = require('../controllers/instructorController');
const authMiddleware = require('../middleware/authMiddleware')

//viewing direct assessment results per student per clo routes
router.get('/directAssessmentResults/:courseCode/:term/:section', [authMiddleware], courseInstructorController.getDirectAssessmentResults);
router.get('/directAssessmentResults/:courseCode/:term/:section/:department', [authMiddleware], courseInstructorController.getDirectAssessmentResultsDepartment);

//student grades routes: question grade and student grades (direct assessment activities)
router.post('/submit-students/:courseCode/:term/:section', [authMiddleware],courseInstructorController.saveStudentActivities);
router.post('/assign-grades/:courseCode/:term/:section', [authMiddleware],courseInstructorController.assignGrades);
router.post('/saveAssessment/:courseCode/:term/:section', [authMiddleware], courseInstructorController.saveAssessment);
router.post('/saveStudentGrades/:courseCode/:term/:section', [authMiddleware], courseInstructorController.saveGrades);
router.get('/assign-grades/:courseCode/:term/:section', [authMiddleware],courseInstructorController.assignGrades);
router.get('/input-grades/:courseCode/:term/:section', [authMiddleware],courseInstructorController.inputGrades);

//indirect assessment activities
router.post('/indirect/:courseCode/:term/:section', [authMiddleware], courseInstructorController.indirectAssessment);
router.post('/saveIndirect/:courseCode/:term/:section', [authMiddleware], courseInstructorController.saveIndirectAssessment);
router.post('/deleteAssessmentDetails/:courseCode/:term/:section', [authMiddleware], courseInstructorController.deleteAssessmentDetails)
module.exports = router;


