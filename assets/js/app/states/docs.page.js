'use strict';

module.exports = {
	url: '/:page',
	template: '<ng-include src="docPagePath" />',
	controller: ['$scope', '$stateParams', function($scope, $params) {
		$scope.docPagePath = './public/html/docs/'+$params.page+'.html';
	}]
};
