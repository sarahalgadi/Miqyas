var express = require('express');
var router = express.Router();

/* GET DCC page. */
router.get('/', function(req, res, next) {
  res.render('dccHome', { title: 'Home' });
});

module.exports = router;