var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'djq' });
});

router.get('/user/testuser' , function( req, res, next){
	res.render('test', { title: 'TestUser'});
});

module.exports = router;
