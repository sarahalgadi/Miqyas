// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const homeController = require('../controllers/homeController');



router.get('/home', [authMiddleware], homeController.getUser);
router.post('/view-section-details/:courseCode/:term/:section', [authMiddleware], homeController.getAssessmentPerSection );
router.get('/view-reports/:department/:term', [authMiddleware], homeController.viewReports);


module.exports = router;
