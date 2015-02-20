'use strict';

module.exports = {
	url: '/docs',
	templateUrl: 'public/html/app/docs.html',
	controller: ['$scope', 'docs', function($scope, docs) {
		$scope.docs = docs;
	}]
};
