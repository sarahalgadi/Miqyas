//creating a router to work over here
const express = require('express');
const router = express.Router();
const dccController = require('../controller/dccController');
const { check } = require('express-validator');

router.post('/', dccController.addCLO);


module.exports = router;