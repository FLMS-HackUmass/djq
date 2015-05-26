var app = angular.module('djq', ['ui.router','youtube-embed', 'uiRouterStyles'])

app.factory('users', ['$http', function($http) {
	var o = {
		users: []
	};

	o.getAll = function(){
		return $http.get('/users').success(function(data) {
			angular.copy(data, o.users);
	})};

	o.addDj = function(dj){
		return $http.post('/users/add', dj).success(function(data){
			o.users.push(data);
	})};

	return o;
}])

// we might not need this, but are keeping it for now...
app.factory('queue', ['$http', function($http) {
	var o = {
		queue: [],
		playing:  {}
	};

	var updateQueue = function(newQueue){
		angular.copy(newQueue,o.queue);
	};

	o.getAll = function(username){
		return $http.get('/users/' + username).success(function(data) {
			updateQueue(data.queue);
	})};

	o.addSong = function(username, song){
		return $http.post('/'+username+'/addSong', song).success(function(data){
			updateQueue(data);
	})};

	o.popSong = function(username, player){
		return $http.post('/'+username+'/popSong').success(function(data){
			
			angular.copy(data, o.playing);
			
			// if we get back an empty JSON object, the queue is empty.
			// so prompt to add more songs
			if (JSON.stringify(data) === "{}"){
				promptToAddSongs("No songs to play!");
			}
			else {
				//the first time a song is popped,
				//setting 'playing' will make the player initialize and start
				if(player != undefined){
					player.loadVideoById(o.playing.url);
				}
				//every other time,
				//a player is already initialized and wont change to the new url
				//so we instead load a video manually
				o.getAll(username);
			}
	})};

	o.upvoteSong = function(username, song){
		return $http.post('/'+username+'/upvoteSong', song).success(function(data){
			updateQueue(data);
	})};

	o.downvoteSong = function(username, song){
		return $http.post('/'+username+'/downvoteSong', song).success(function(data){
			updateQueue(data);
	})};

	return o;
}])

app.config ([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {

		$urlRouterProvider.when("/", ['$state', '$match', function ($state, $match) {
			$state.go('home');
		}]);

		$stateProvider
			.state('common', {
				templateUrl: 'views/common.html',
				abstract: true
			})
			.state('home', {
				url: '/home',
				parent: 'common',
				templateUrl: 'views/home.html',
				data: {
					//css: '/stylesheets/cover.css'
				}
			})
			.state('about', {
				url: '/about',
				parent: 'common',
				templateUrl: 'views/about.html'
			})
			.state('admin', {
				url: '/admin',
				parent: 'common',
				templateUrl: 'views/admin.html',
				controller: 'MainCtrl',
				resolve: {
					postPromise: ['users', function(users){
						return users.getAll();
					}]
				}
			})
			.state('users', {
				url: '/:username',
				parent: 'common',
				templateUrl: 'views/dj.html',
				controller: 'UsersCtrl',
				resolve: {
					postPromise: ['$stateParams', 'queue', function($stateParams, queue) {
						return queue.getAll($stateParams.username);
					}]
				}
			});
	
	$locationProvider.html5Mode(true);
}]);

app.controller('MainCtrl', [
	'$scope',
	'users',
	function($scope, users) {
		$scope.users = users.users

		$scope.addDj = function() {
			if (!$scope.username || $scope.username === '') { 
				alert("Please enter a username!");
				return;
			}
			if (!$scope.password || $scope.password === '') { 
				alert("Please enter a password!");
				return;
			}
			if (!$scope.email || $scope.email === '') { 
				alert("Please enter an email!");
				return;
			}
			var dj = {	username: 	$scope.username,
					  	password: 	$scope.password,
						email: 		$scope.email
			};

			users.addDj(dj);

			$scope.username	= '';
			$scope.password = '';
			$scope.email 	= '';
		}
	}]
);

app.controller('UsersCtrl', [
	'$scope',
	'$compile',
	'$stateParams',
	'queue',
	function($scope, $compile, $stateParams, queue) {
		$scope.username = $stateParams.username;
		$scope.queue = queue.queue;
		$scope.playing = queue.playing;

		$scope.playerVars = {
    		autoplay: 1
		};

		$scope.keyPress = function() {
			if ($('#searchbar').val() === '') {
				$('#results').hide();
			} else {
				$('#results').show();
				search($('#searchbar').val());
			}
		}

		$scope.mousePressed = function() {
			queue.getAll($scope.username);
			$('#results').hide();
			$('#searchbar').val('');
			$('#searchbar').blur();
			queue.getAll($scope.username);
		}

		$scope.showOrHidePlayer = function() {
			
			// if the player is null...
			if ($scope.player == undefined) {
				// refresh the queue to see if any new songs have come in
				queue.getAll($scope.username);

				// if the queue is still empty, prompt the user to add songs to it
				if ($scope.queue.length == 0) {
					promptToAddSongs("No songs to play!");	
				}
				// otherwise, if the queue is not empty, let the user know that in order 
				// to see the player, the player will begin playing back content
				else {
					promptToBeginPlayback();
				}
			}
			// change the button appearance
			else if($('#player-container').css('display') === 'none') {
				slidePlayerDown();
				flipShowPlayerButton(true);
			}
			else {
				slidePlayerUp();
				flipShowPlayerButton(false);
			}
		}

		// called when there are no songs left in the queue and either the player tries to
		// auto advance after a song has finished, or if the user tries to interact with the
		// player (i.e., "Play Next Song", fast forward, or show the player)
		promptToAddSongs = function(error_msg, callback) {
			sweetAlert({
				title: error_msg,
				text: "That's okay! Click the \"Add song\" button below in order to add some music to your queue.",
				type: "warning",
				showCancelButton: true,
				cancelButtonText: "Not yet",
				confirmButtonText: "Add song",
				confirmButtonColor: "#66AFE9",
				closeOnConfirm: true
			}, function() {
				$('#myModal').modal('show');
				$scope.giveFocusToSearch();
			});
		}

		// called when there ARE songs in the queue, but the player has not been instantiated
		// yet. this should only be used when they click "show player" to give the user some
		// warning that the player can only be shown once the music begins to play
		promptToBeginPlayback = function() {
			sweetAlert({
				title: "Begin playback?",
				text: "In order to show the player, you must begin playback of your queued music. Would you like to start playing music?",
				type: "warning",
				showCancelButton: true,
				cancelButtonText: "Not yet",
				confirmButtonText: "Yes",
				confirmButtonColor: "#66AFE9",
				closeOnConfirm: true
			}, function() {
				slidePlayerDown($scope.popSong());
			});
		}

		slidePlayerDown = function(callback) {
			if ($('#player-container').hasClass('hidden')) {
				$('#player-container').removeClass('hidden');
			}
			$('#player-container').slideDown(callback);
		}

		slidePlayerUp = function() {
			$('#player-container').slideUp(function() {
				$('#player-container').addClass('hidden');
			});
		}

		// if player is showing, button should display option to hide it
		// if player is hidden, button should display option to show it.
		flipShowPlayerButton = function(isPlayerShown) {
			if (isPlayerShown) {
				$('#hide-player').text("Hide Player ");
				$('#hide-player').append("<span class='glyphicon glyphicon-eye-close'></span>");
			} else {
				$('#hide-player').text("Show Player ");
				$('#hide-player').append("<span class='glyphicon glyphicon-eye-open'></span>");
			}
		}

		$scope.applyActiveOnHover = function(event) {
			$(event.target.parentElement).addClass("active");
		}

		$scope.removeActiveOnLeave = function(event) {
			$(event.target.parentElement).removeClass("active");
		}

		$scope.giveFocusToSearch = function() {
			$('#myModal').on('shown.bs.modal', function() {
				$('#searchbar').focus();
			})
		}

		$scope.refresh = function() {
			queue.getAll($scope.username);
		}

		$scope.upvoteSong = function(song) {
			queue.upvoteSong($scope.username, song);
		}

		$scope.downvoteSong = function(song) {
			queue.downvoteSong($scope.username, song);
		}

		$scope.popSong = function() {
			/*if ($scope.queue.length == 0) {
				promptToAddSongs("No songs to play!");
			} else {*/
			queue.popSong($scope.username, $scope.player);
			//}
		}

		$scope.$on('youtube.player.ended', function ($event, player) {
			/*if ($scope.queue.length == 0) {
				promptToAddSongs("All out of songs!");
			}*/
    		$scope.popSong();
  		});

		//setting the player to a variable in the ejs file allows calls to an uninitialized player
		//instead, we set the player whenever it is initialized
  		$scope.$on('youtube.player.ready', function ($event, player) {
    		$scope.player = player;
  		});
	}
]);
