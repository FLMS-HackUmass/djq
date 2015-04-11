var app = angluar.module('djq', ['ui.router']);

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
			.state('')
	}])