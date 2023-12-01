const express = require('express');
const router = express.Router();
const dccController = require('../controllers/dccController');


router.post('/edit-clos/:department/:term', dccController.editCLOs);
router.post('/save-clos/:courseCode/:term', dccController.saveCLOs);
router.get('/edit-clos/:department/:term', dccController.editCLOs);
router.get('/get-clos/:courseCode/:term', dccController.getCLOs); /////
module.exports = router;