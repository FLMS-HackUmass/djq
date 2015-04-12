var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('addsearch', { title: 'DJ Queue me up!' });
});

module.exports = router;
