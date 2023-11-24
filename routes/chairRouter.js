const express = require('express');
const router = express.Router();
const roleAssignment = require('../controllers/chairController');


router.get('/view-faculty-department/:department/:term', roleAssignment.getFacultyFromDepartment);
router.post('/save-roles/:department/:semester/:username', roleAssignment.saveRoles )

module.exports = router;