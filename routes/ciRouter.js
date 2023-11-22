var express = require('express');
var router = express.Router();

/* GET assessment page. */
router.get('/', function(req, res, next) {
  res.render('assessmentTypes', { title: 'Assessment Types' });
});

module.exports = router;