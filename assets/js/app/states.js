'use strict';

module.exports = [
	'$urlRouterProvider',
	'$stateProvider',
	function($urlRouterProvider, $stateProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider

			.state('app', require('./states/app'))
			.state('app.page', require('./states/app.page'))
			.state('app.page.sub', require('./states/app.page.sub'))


/*
			.state('docs', require('./states/docs.js') )
				.state('docs.page', require('./states/docs.page.js') )

			.state('page', {
				url: '/:page',
				template: '<ng-include marked src="pagePath" highlight />',
				controller: ['$scope', '$stateParams', function($scope, $params) {
					$scope.pagePath = './pages/'+$params.page+'.md';
				}]
			})
*/
		;

}];
