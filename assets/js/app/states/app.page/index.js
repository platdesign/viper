'use strict';

module.exports = {
	url: ':page',
	resolve: {
		_page: ['pages', '$stateParams', function(pages, $stateParams) {
			return pages.getPage($stateParams.page);
		}]
	},
	//template: '<ng-include marked src="pagePath" highlight />',
	template: require('./template.jade'),
	controller: ['$scope', '_page', function($scope, _page) {

		$scope._page = _page;

		var indexUrl = _page.url + '/index.md';

		$scope.pagePath = indexUrl;
	}]
};
