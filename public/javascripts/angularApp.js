var app = angular.module('djq', ['ui.router'])

app.factory('users', ['$http', function($http) {
	var o = {
		users: []
	};

	o.getAll = function(){
		return $http.get('/users').success(function(data) {
			angular.copy(data, o.users);
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

		$scope.addUser = function() {
			if (!$scope.username || $scope.username === '') { 
				alert("Please enter a username!");
				return;
			}
			if (!$scope.password || $scope.password === '') { 
				alert("Please enter a password!");
				return;
			}

			$scope.users.push({
				username: $scope.username,
				password: $scope.password,
				queue: [
					{title: 'Uptown Funk', priority: 0},
					{title: 'Sandstorm', priority: 0}
				]
			});
			$scope.username = '';
			$scope.password = '';
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
