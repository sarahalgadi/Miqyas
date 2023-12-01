const express = require('express');
const router = express.Router();
const roleAssignment = require('../controllers/chairController');


router.get('/view-faculty-department/:department/:term', roleAssignment.getFacultyFromDepartment);
router.post('/save-roles/:semester', roleAssignment.saveRoles )


router.post('/save-roles/:semester', roleAssignment.saveCoordinators)
router.get('/view-faculty-college/:college/:department/:term', roleAssignment.getFacultyFromCollege);


module.exports = router;