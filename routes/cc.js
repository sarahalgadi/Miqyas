const express = require('express');
const router = express.Router();
const courseReport = require('../controllers/viewCourseReportController');

router.get('/view-course-report/:courseCode/:term', courseReport.viewCourseReport);
router.get('/view-course-report/:courseCode/:term/:department', courseReport.displayByDepartment);


module.exports = router;
