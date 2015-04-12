var express = require('express');
var router = express.Router();
var DJ = require('../models/dj');


// //add jo to database
// router.get('/users/add', function (req, res, next) {
// 	var dj1 = new DJ;
// 	dj1.username = 'jo';
// 	dj1.save(function(err){
// 		if(err) return res.send(err);
// 		res.render('index', { title: 'added new DJ jo!' });
// 	});
// 	console.log('added new DJ jo!');
// });

router.get('/', function (req, res, next) {
	res.render('index')
});

router.get('/users', function (req, res, next) {
	var query = DJ.find();
	query.find({}).exec(function(err,result){
		if(err) return res.send(err);
		res.json(result);
	});
});


//add user to database
router.get('/users/add', function (req, res, next) {
	res.render('newuser', { title: 'add new user!'});
});

//add user to database
router.post('/users/add', function (req, res, next) {
	var dj = new DJ(req.body);
	dj.save(function(err){
		if(err) return res.send(err);
		res.redirect('/'+dj.username);
	});
	console.log('added new DJ ' + dj.username + '!');
});

//add song to queue
router.get('/songs/add', function (req, res, next) {
	res.render('newsong', { title: 'add new song!'});
});

//add song to queue
router.post('/songs/add', function (req, res, next) {
	var username = req.body.username;
	findUserByUsername(username, function(err, dj) {
		if (err) return res.send(err);

		var queue = dj.queue;
		delete req.body.username;
		var song = req.body;
		queue.push(song);

		dj.save(function(err){
			if(err) return res.send(err);
			res.end();
		});

		console.log('added new song ' + song + '!');
	});
});

//upvote song in queue
router.get('/songs/upvote', function (req, res, next) {
	res.render('upvote', { title: 'upvote song!'});
});

var searchForSong = function(queue, id){
	id = JSON.stringify(id);
	var song;
	for(var i=0; i<queue.length; i++){
		console.log(queue[i]._id);
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

//upvote song in queue
router.post('/songs/upvote', function (req, res, next) {
	var username = req.body.username;
	findUserByUsername(username, function(err, dj) {
		if (err) return res.send(err);

		var queue = dj.queue;
		console.log(dj.queue);
		var song = searchForSong(queue, req.body.songId);
		console.log(song);
		voteForSong(queue,song,req.body.vote);

		dj.save(function(err){
			if(err) return res.send(err);
			res.end();
		});

		console.log('upvoted song ' + song + '!');
	});
});

var findUserByUsername = function (username, callback) {
  // Perform database query that calls callback when it's done
  var query = DJ.find();
  query.findOne({username: username}).exec(function(err,result){
  	if(err) return callback(err);
  	if(result===null) return callback('No user matching ' + username);
  	return callback(null, result);
  });
};

router.get('/:username', function (req, res, next) {
	res.render('index');
});

router.get('/users/:username', function (req, res, next) {
	var username = req.params.username;
	findUserByUsername(username, function(err, dj) {
		if (err) return res.send(err);
		console.log(dj);
		res.json(dj);
	});
});

module.exports = router;
