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
			//the first time a song is popped,
			//setting 'playing' will make the player initialize and start
			angular.copy(data, o.playing);
			//every other time,
			//a player is already initialized and wont change to the new url
			//so we instead load a video manually
			if(player != undefined){
				player.loadVideoById(o.playing.url);
			}
			o.getAll(username);
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

		$scope.slidePlayer = function() {
			if ($scope.player == undefined) {
				sweetAlert({
					title: "Choose a song first!",
					text: "Start playing back a song and then you'll be able to view the player.",
					type: "warning",
					showCancelButton: true,
					cancelButtonText: "OK",
					confirmButtonText: "Choose Song",
					confirmButtonColor: "#66AFE9",
					closeOnConfirm: true	
				}, function() {
					$('#add-btn').trigger('click');
				});
			}
			// change the button appearance
			else if($('#player-container').css('display') === 'none') {
				if ($('#player-container').hasClass('hidden')) {
					$('#player-container').removeClass('hidden');
				}
				$('#player-container').slideDown();
				$('#hide-player').text("Hide Player ");
				$('#hide-player').append("<span class='glyphicon glyphicon-eye-close'></span>");
			}
			else {
				$('#player-container').slideUp(function() {
					$('#player-container').addClass('hidden');
				});
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
			queue.popSong($scope.username, $scope.player);
		}

		$scope.$on('youtube.player.ended', function ($event, player) {
    		$scope.popSong();
  		});

		//setting the player to a variable in the ejs file allows calls to an uninitialized player
		//instead, we set the player whenever it is initialized
  		$scope.$on('youtube.player.ready', function ($event, player) {
    		$scope.player = player;
  		});
	}
]);
