const express = require('express');
const router = express.Router();
const coordinator = require('../controllers/coordinatorTabsController');
const authMiddleware = require('../middleware/authMiddleware');



router.get('/display-course/:courseCode/:term',[authMiddleware], coordinator.getCoordinatedCourse);
router.post('/submit-form/:courseCode/:term', [authMiddleware], coordinator.saveDirectAssessmentTypes);

module.exports = router;
