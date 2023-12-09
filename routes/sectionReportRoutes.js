const express = require('express');
const router = express.Router();
const sectionReport = require('../controllers/editSectionReportController');
const viewReport = require('../controllers/viewSectionReportController');
const authMiddleware = require('../middleware/authMiddleware');

//editing section report activities
router.get('/edit-section-report/:courseCode/:term/:section', [authMiddleware], sectionReport.editSectionReport);
router.get('/edit-section-report/:courseCode/:term/:section/:department', [authMiddleware], sectionReport.editSectionReportDepartment);
router.post('/save-section-report/:courseCode/:term/:section',[authMiddleware], sectionReport.saveSectionReport);
router.post('/delete-action-plan/:courseCode/:term/:section', [authMiddleware], sectionReport.deleteActionPlan);

//viewing section report activities
router.get('/view-section-report/:courseCode/:term/:section', [authMiddleware], viewReport.viewSectionReport);
router.get('/view-section-report/:courseCode/:term/:section/:department', [authMiddleware], viewReport.viewSectionReportDepartment);

module.exports = router;


