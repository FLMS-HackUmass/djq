var app = angular.module('djq', ['ui.router'])

app.factory('users', [function() {
	var o = {
		users: []
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
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl'
			});

		$stateProvider
			.state('users', {
				url: '/users/{id}',
				templateUrl: '/users.html',
				controller: 'UsersCtrl'
			})

	$urlRouterProvider.otherwise('home');

	$locationProvider.html5Mode(true);
}]);

app.controller('MainCtrl', [
	'$scope',
	'users',
	function($scope, users) {
		$scope.users = users.users

		$scope.addUser = function() {
			if (!$scope.name || $scope.name === '') { 
				alert("Please enter a username!");
				return;
			}
			if (!$scope.password || $scope.password === '') { 
				alert("Please enter a password!");
				return;
			}

			$scope.users.push({
				name: $scope.name,
				password: $scope.password,
				songs: [
					{title: 'Uptown Funk', upvotes: 0},
					{title: 'Sandstorm', upvotes: 0}
				]
			});
			$scope.name = '';
			$scope.password = '';
		}
	}]);

app.controller('UsersCtrl', [
	'$scope',
	'$stateParams',
	'users',
	function($scope, $stateParams, users) {
		$scope.user = users.users[$stateParams.id];
	}])
