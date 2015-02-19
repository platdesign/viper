'use strict';

module.exports = {
	url: '/*page',
	template: '<ng-include marked src="docPagePath" />',
	controller: ['$scope', '$stateParams', function($scope, $params) {
		$scope.docPagePath = './docs/'+$params.page+'.md';
	}]
};
