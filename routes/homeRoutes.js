// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const homeController = require('../controllers/homeController');
const viewAllReportsController = require('../controllers/viewAllReportsController')
//temp 
const courseInstructorController = require('../controllers/courseInstructor');


// Example route that requires authentication
router.get('/home', [authMiddleware], homeController.getUser);

router.post('/view-section-details/:courseCode/:term/:section', [authMiddleware], homeController.getAssessmentPerSection );
//temp
router.get('/directAssessmentResults/:courseCode/:term/:section', [authMiddleware],courseInstructorController.getDirectAssessmentResults);

router.get('/view-reports/:department/:term', [authMiddleware], viewAllReportsController.viewReports);


module.exports = router;
