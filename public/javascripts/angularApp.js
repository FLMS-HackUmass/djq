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
app.factory('queue', [function() {
	var o = {
		queue: [{title:'hi'}]
	};
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
			});

		$stateProvider
			.state('users', {
				url: '/{user.username}',
				templateUrl: '/dj.html',
				controller: 'UsersCtrl'
			})

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
		$scope.user = users.users[$stateParams.id];
		var user;
		user.username='stanleyrya'
		$scope.user = user;
		queue.push({title:'hi'});
		$scope.queue = queue.queue;

		$scope.getQueue = function() {
			queue = $scope.queue;
		}
	}])
