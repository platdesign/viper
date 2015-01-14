'use strict';

module.exports = function() {

	this.provider('home', function() {
		return function() {
			return 'HOME123';
		};
	});

	this.config(function(config) {

	});

	this.service('injectedRouteHandler', function(inject) {
		return function(handler) {
			return function(req, res) {
				inject(handler, { req:req, res:res });
			};
		};
	});

	this.run(function(home, router, injectedRouteHandler) {

		router.get('/', injectedRouteHandler(function(home, res) {
			res.json(home);
		}));

	});

};



