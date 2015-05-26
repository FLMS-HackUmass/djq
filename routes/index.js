var express = require('express');
var router = express.Router();
var DJ = require('../models/dj');

//helper functions
var findUserByUsername = function (username, callback) {
  // Perform database query that calls callback when it's done
  var query = DJ.find();
  query.findOne({username: username}).exec(function(err,result){
  	if(err) return callback(err);
  	if(result===null) return callback('No user matching ' + username);
  	return callback(null, result);
  });
};

var searchForSong = function(queue, id){
	id = JSON.stringify(id);
	var song;
	for(var i=0; i<queue.length; i++){
		if(JSON.stringify(queue[i]._id) === id) song = queue[i];
	}
	return song;
};

var sortQueue = function(queue){
	queue.sort(function (a,b){
		//priority > timestamp
		if(a.priority===b.priority){
			//convert timestamps into dates (ISO-8601)
			a.timestamp2 = new Date(a.timestamp);
			b.timestamp2 = new Date(b.timestamp);
			//most recent date first
			return a.timestamp2-b.timestamp2;
		}
		//highest priority first
		return b.priority-a.priority;
	});
};

//load home page
router.get('/', function (req, res, next) {
	res.render('index.html');
});

router.get('/admin', function (req, res, next) {
	res.render('index.html');
});

// refactor view engine for multiple pages!!
router.get('/views/:name', function(req, res) {
	var name = req.params.name;
	console.log("**** REQUEST MADE FOR " + name);
	res.render(name);
});

/*router.get('/testuser', function(req, res, next) {
	res.render('test');
});*/

//get all users
router.get('/users', function (req, res, next) {
	var query = DJ.find();
	query.find({}).exec(function(err,result){
		if(err) return res.send(err);
		res.json(result);
	});
});

//add dj to database
router.post('/users/add', function (req, res, next) {
	var dj = new DJ(req.body);
	dj.save(function(err,result){
		if(err) return res.send(err);
		res.json(result);
	});
});

//load dj page
router.get('/:username', function (req, res, next) {
	res.render('index.html');
});

//get specific user
router.get('/users/:username', function (req, res, next) {
	var username = req.params.username;
	findUserByUsername(username, function(err, dj) {
		if (err) return res.send(err);
		res.json(dj);
	});
});

//add song to queue
router.post('/:username/addSong', function (req, res, next) {
	var username = req.params.username;
	findUserByUsername(username, function(err, dj) {
		if (err) return res.send(err);

		var queue = dj.queue;
		var song = req.body;
		queue.push(song);
		sortQueue(queue);

		dj.save(function(err,result){
			if(err) return res.send(err);
			res.json(result.queue);
		});
	});
});

//pop song from queue
router.post('/:username/popSong', function (req, res, next) {
	var username = req.params.username;
	findUserByUsername(username, function(err, dj) {
		if (err) return res.send(err);

		var queue = dj.queue;
		var song = queue.shift();

		dj.save(function(err,result){
			if(err) return res.send(err);
			res.json(song);
		});
	});
});

//upvote song in queue
router.post('/:username/upvoteSong', function (req, res, next) {
	var username = req.params.username;
	findUserByUsername(username, function(err, dj) {
		if (err) return res.send(err);

		var queue = dj.queue;
		var song = req.body;
		song = searchForSong(queue, song._id);
		song.priority += 1;
		sortQueue(queue);

		dj.save(function(err, result){
			if(err) return res.send(err);
			res.json(result.queue);
		});
	});
});

//downvote song in queue
router.post('/:username/downvoteSong', function (req, res, next) {
	var username = req.params.username;
	findUserByUsername(username, function(err, dj) {
		if (err) return res.send(err);

		var queue = dj.queue;
		var song = req.body;
		song = searchForSong(queue, song._id);
		song.priority += -1;
		sortQueue(queue);

		dj.save(function(err, result){
			if(err) return res.send(err);
			res.json(result.queue);
		});
	});
});

module.exports = router;
