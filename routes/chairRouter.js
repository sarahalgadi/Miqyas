const express = require('express');
const router = express.Router();
const roleAssignment = require('../controllers/chairController');


router.get('/view-faculty-department/:department/:term', roleAssignment.getFacultyFromDepartment);
router.post('/save-roles/:term', roleAssignment.saveRoles );

router.post('/save-coordinator-roles/:term/:college/:department', roleAssignment.saveCoordinators);

router.get('/view-faculty-college/:college/:department/:term', roleAssignment.getFacultyFromCollege);


module.exports = router;