const express = require('express');
const router = express.Router();
const sectionReport = require('../controllers/editSectionReportController');
const viewReport = require('../controllers/viewSectionReport');


router.get('/edit-section-report/:courseCode/:term/:section', sectionReport.editSectionReport);
router.get('/edit-section-report/:courseCode/:term/:section/:department', sectionReport.editSectionReportDepartment);
router.post('/save-section-report/:courseCode/:term/:section', sectionReport.saveSectionReport);

router.get('/view-section-report/:courseCode/:term/:section', viewReport.viewSectionReport);
router.get('/view-section-report/:courseCode/:term/:section/:department', viewReport.viewSectionReportDepartment);
module.exports = router;