const express = require('express');
const router = express.Router();
const dccController = require('../controllers/dccController');


router.post('/edit-clos/:department/:term', dccController.editCLOs);
router.post('/save-clos/:courseCode/:term', dccController.saveCLOs);

module.exports = router;