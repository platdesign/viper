'use strict';

module.exports = {
	url: '/',
	resolve: {
		_config: ['$http', 'pages', function($http, pages) {
			return $http.get('./pages.json').then(function(res) {
				pages.setConfig(res.data);
				return res.data;
			});
		}]
	},
	controller: ['$scope', '_config', function($scope, config) {
		$scope._config = config;
		$scope.indexView = './pages/index.md';
		$scope.pages = config.pages || {};
	}],
	template: require('./template.jade')
};
