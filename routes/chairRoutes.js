const express = require('express');
const router = express.Router();
const roleAssignment = require('../controllers/chairController');
const authMiddleware = require('../middleware/authMiddleware');
//---------------------------assign roles-----------------------------------------------------------------------------

router.get('/view-faculty-department/:department/:term', [authMiddleware], roleAssignment.getFacultyFromDepartment);
router.post('/save-roles/:term/:department', [authMiddleware],  roleAssignment.saveRoles );

//---------------------------coordinator-----------------------------------------------------------------------------
router.post('/save-coordinator-roles/:term/:college/:department',  [authMiddleware], roleAssignment.saveCoordinators);
router.get('/view-faculty-college/:college/:department/:term',  [authMiddleware], roleAssignment.getFacultyFromCollege);

//----------------------------delete roles

router.post('/delete-roles/:semester',  [authMiddleware], roleAssignment.deleteRole);
router.post('/delete-coordinator/:semester', [authMiddleware],  roleAssignment.deleteCoordinatorRole);

module.exports = router;