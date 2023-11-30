const express = require('express');
const router = express.Router();
const courseInstructorController = require('../controller/ciController');

router.get('/indirect/:courseCode', courseInstructorController.renderCourseDetails);
router.post('/saveIndirect/:courseCode/:term/:section', courseInstructorController.saveIndirectAssessment)
module.exports = router;