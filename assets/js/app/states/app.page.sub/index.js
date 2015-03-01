'use strict';

module.exports = {
	url: '/:sub',
	resolve: {
		_page: ['_page', '$stateParams', function(_page, $stateParams) {
			return _page.getSub($stateParams.sub);
		}]
	},
	template: require('./template.jade'),
	controller: ['$scope', '_page', function($scope, _sub) {
		$scope._sub = _sub;
	}]
};
