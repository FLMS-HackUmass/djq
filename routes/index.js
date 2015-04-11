var express = require('express');
var router = express.Router();
var dj = require('../models/dj');

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Express' });
});

router.get('/users', function(req, res, next) {
	var query = dj.find();
	query.find({}).exec(function(err,result){
		if(err){
			return res.send(err);
		}
		res.render('index', { title: result });
	});
});

router.get('/users/add', function(req, res, next) {
	var dj1 = new dj;
	dj1.username = 'jo';
	dj1.save(function(err){
		if(err){
			return res.send(err);
		}
		res.render('index', { title: 'added jo!' });
	});
	console.log('added new user jo!');
});

module.exports = router;