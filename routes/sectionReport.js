const express = require('express');
const router = express.Router();
const sectionReport = require('../controllers/editSectionReportController');



router.get('/edit-section-report/:courseCode/:term/:section', sectionReport.editSectionReport);
router.get('/edit-section-report/:courseCode/:term/:section/:department', sectionReport.editSectionReportDepartment);
router.post('/save-section-report/:courseCode/:term/:section', sectionReport.saveSectionReport);

router.post('/delete-action-plan/:courseCode/:term/:section',sectionReport.deleteActionPlan);

module.exports = router;