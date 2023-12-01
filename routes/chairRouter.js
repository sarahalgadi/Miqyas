const express = require('express');
const router = express.Router();
const roleAssignment = require('../controllers/chairController');


router.get('/view-faculty-department/:department/:term', roleAssignment.getFacultyFromDepartment);
router.post('/save-coordinator-roles/:semester/:college/:department', roleAssignment.saveRoles )


router.post('/save-roles/:semester', roleAssignment.saveCoordinators)
router.get('/view-faculty-college/:college/:department/:term', roleAssignment.getFacultyFromCollege);

router.post('/delete-roles/:semester',roleAssignment.deleteRole);
router.post('/delete-coordinator/:semester',roleAssignment.deleteCoordinatorRole);


module.exports = router;