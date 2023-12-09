const express = require('express');
const router = express.Router();
const courseReport = require('../controllers/courseReportController');
const courseReportView = require('../controllers/viewCourseReportController')
const authMiddleware = require('../middleware/authMiddleware');


//editing course reports
router.get('/course-report/:courseCode/:term',[authMiddleware], courseReport.editCourseReport);
router.get('/course-report/:courseCode/:term/:department', [authMiddleware], courseReport.displayByDepartment);
router.post('/save-course-report/:courseCode/:term', [authMiddleware], courseReport.saveCourseReport);

//viewing course reports
router.get('/view-course-report/:courseCode/:term', [authMiddleware], courseReportView.viewCourseReport);
router.get('/view-course-report/:courseCode/:term/:department',[authMiddleware], courseReportView.displayByDepartment);

module.exports = router;
