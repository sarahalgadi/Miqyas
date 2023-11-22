const express = require('express');
const router = express.Router();
const courseReport = require('../controllers/courseReportController');

router.get('/course-report/:courseCode/:term', courseReport.editCourseReport);
router.get('/course-report/:courseCode/:term/:department', courseReport.displayByDepartment);
router.post('/save-course-report/:courseCode/:term', courseReport.saveCourseReport);


module.exports = router;
