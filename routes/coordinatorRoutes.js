const express = require('express');
const router = express.Router();
const coordinator = require('../controllers/coordinatorTabsController');



router.get('/display-course/:courseCode/:term', coordinator.getCoordinatedCourse);
router.post('/submit-form/:courseCode/:term', coordinator.saveDirectAssessmentTypes);

module.exports = router;
