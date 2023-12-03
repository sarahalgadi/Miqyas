const express = require('express');
const router = express.Router();
const dccController = require('../controllers/dccController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/edit-clos/:department/:term', [authMiddleware], dccController.editCLOs);
router.post('/edit-clos/:department/:term', [authMiddleware], dccController.editCLOs);
router.post('/save-clos/:courseCode/:term', [authMiddleware], dccController.saveCLOs);
router.get('/get-clos/:courseCode/:term', [authMiddleware], dccController.getCLOs); 

module.exports = router;