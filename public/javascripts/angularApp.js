var app = angular.module('djq', ['ui.router'])

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
		queue: []
	};

	o.getAll = function(username){
		return $http.get('/users/' + username).success(function(data) {
			angular.copy(data.queue, o.queue);
	})};

	return o;
}])

app.config ([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: '/home.html',
				controller: 'MainCtrl',
				resolve: {
					postPromise: ['users', function(users){
						return users.getAll();
					}]
				}
			})

			.state('users', {
				url: '/:username',
				templateUrl: '/dj.html',
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
			$scope.users.push(dj);

			$scope.username = '';
			$scope.password = '';
			$scope.email 	= '';
		}
	}]);

app.controller('UsersCtrl', [
	'$scope',
	'$stateParams',
	'queue',
	function($scope, $stateParams, queue) {
		$scope.username = $stateParams.username;
		$scope.queue = queue.queue;
	}])
