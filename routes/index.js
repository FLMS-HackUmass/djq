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

var voteForSong = function(queue, song, vote){
	//update song's priority
	song.priority += vote;
	//re-sort queue
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
	res.render('index');
});

router.get('/testuser', function(req, res, next) {
	res.render('test');
});

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
	res.render('index');
});

//get specific user
router.get('/users/:username', function (req, res, next) {
	var username = req.params.username;
	findUserByUsername(username, function(err, dj) {
		if (err) return res.send(err);
		console.log(dj);
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

		dj.save(function(err,result){
			if(err) return res.send(err);
			res.end();
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
		console.log(song);
		var song = searchForSong(queue, song._id);
		voteForSong(queue,song,1);

		dj.save(function(err){
			if(err) return res.send(err);
			res.end();
		});
	});
});

module.exports = router;
