const express = require('express');
const router = express.Router();
const courseReport = require('../controllers/courseReportController');
const courseReportView = require('../controllers/viewCourseReportController')

//editing course reports
router.get('/course-report/:courseCode/:term', courseReport.editCourseReport);
router.get('/course-report/:courseCode/:term/:department', courseReport.displayByDepartment);
router.post('/save-course-report/:courseCode/:term', courseReport.saveCourseReport);

//viewing course reports
router.get('/view-course-report/:courseCode/:term', courseReportView.viewCourseReport);
router.get('/view-course-report/:courseCode/:term/:department', courseReportView.displayByDepartment);

module.exports = router;
