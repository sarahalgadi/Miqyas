// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const homeController = require('../controllers/homeController');

// Example route that requires authentication
router.get('/home', [authMiddleware], homeController.getUser);


module.exports = router;
