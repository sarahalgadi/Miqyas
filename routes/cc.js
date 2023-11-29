const express = require('express');
const router = express.Router();
const courseReport = require('../controllers/viewCourseReportController');
const coordinator = require('../controllers/coordinatorTabsController');


//todo: move this route to course report. the only things that should be routed.. only for course coordinator
//todo: 100% special for course coordinator

router.get('/view-course-report/:courseCode/:term', courseReport.viewCourseReport);
router.get('/view-course-report/:courseCode/:term/:department', courseReport.displayByDepartment);
router.get('/display-course/:courseCode/:term', coordinator.getCoordinatedCourse);
router.post('/submit-form/:courseCode/:term', coordinator.saveDirectAssessmentTypes);

module.exports = router;
