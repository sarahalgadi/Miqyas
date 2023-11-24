const express = require('express');
const router = express.Router();
const sectionReport = require('../controllers/editSectionReportController');


router.get('/edit-section-report/:courseCode/:term/:section', sectionReport.editSectionReport);
router.get('/edit-section-report/:courseCode/:term/:section/:department', sectionReport.editSectionReportDepartment);
module.exports = router;