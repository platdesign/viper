'use strict';

module.exports = {
	url: '/docs',
	template: require('./docs.jade'),
	controller: ['$scope', 'docs', function($scope, docs) {
		$scope.docs = docs;
	}]
};
