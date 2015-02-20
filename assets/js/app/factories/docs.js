'use strict';


module.exports = ['$http', function($http) {

	var service = {};

	$http.get('./docs/config.json')
	.then(function(res) {
		angular.extend(service, res.data);
	});


	return service;

}];
