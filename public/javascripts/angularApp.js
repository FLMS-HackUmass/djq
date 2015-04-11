var app = angular.module('djq', ['ui.router']);

app.factory('songs', function(){
	var o = {
		songs: []
	};
	return o;
});

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl'
			});

		$stateProvider
			.state('test', {
				url: '/user/testuser',
				templateUrl: '/user.html',
				controller: 'UserCtrl'
			});
		
		$urlRouterProvider.otherwise('home');
	}
]);

app.controller('UserCtrl', [
	'$scope',
	'$stateParams',
	'users',
	function($scope, $stateParams, users) {
		
	}]);