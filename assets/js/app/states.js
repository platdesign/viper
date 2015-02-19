'use strict';

module.exports = [
	'$urlRouterProvider',
	'$stateProvider',
	function($urlRouterProvider, $stateProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home',{ url: '/'})
			.state('about', require('./states/about.js') )
			.state('docs', require('./states/docs.js') )

		;

}];
