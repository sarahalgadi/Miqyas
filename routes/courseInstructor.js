const express = require('express');
const router = express.Router();
const courseInstructorController = require('../controllers/instructorController');
const authMiddleware = require('../middleware/authMiddleware')

//todo: fix this orute.. and adjust submit students
router.get('/directAssessmentResults/:courseCode/:term/:section', courseInstructorController.getDirectAssessmentResults);
router.get('/directAssessmentResults/:courseCode/:term/:section/:department', courseInstructorController.getDirectAssessmentResultsDepartment);
router.post('/submit-students/:courseCode/:term/:section', [authMiddleware],courseInstructorController.saveStudentActivities);
router.post('/assign-grades/:courseCode/:term/:section', [authMiddleware],courseInstructorController.assignGrades);
router.post('/saveAssessment/:courseCode/:term/:section', [authMiddleware], courseInstructorController.saveAssessment);
router.post('/saveStudentGrades/:courseCode/:term/:section', [authMiddleware], courseInstructorController.saveGrades);
router.get('/assign-grades/:courseCode/:term/:section', [authMiddleware],courseInstructorController.assignGrades);
router.get('/input-grades/:courseCode/:term/:section', [authMiddleware],courseInstructorController.inputGrades);
router.post('/indirect/:courseCode/:term/:section', courseInstructorController.indirectAssessment);
router.post('/saveIndirect/:courseCode/:term/:section', courseInstructorController.saveIndirectAssessment);

router.post('/deleteAssessmentDetails/:courseCode/:term/:section', [authMiddleware], courseInstructorController.deleteAssessmentDetails)
module.exports = router;


