const express = require('express');
const router = express.Router();
const roleAssignment = require('../controllers/chairController');

//---------------------------assign roles-----------------------------------------------------------------------------

router.get('/view-faculty-department/:department/:term', roleAssignment.getFacultyFromDepartment);
router.post('/save-roles/:term/:department', roleAssignment.saveRoles );

//---------------------------coordinator-----------------------------------------------------------------------------
router.post('/save-coordinator-roles/:term/:college/:department', roleAssignment.saveCoordinators);
router.get('/view-faculty-college/:college/:department/:term', roleAssignment.getFacultyFromCollege);


module.exports = router;