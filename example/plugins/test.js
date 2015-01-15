'use strict';

module.exports = function() {

	this.provider('home', function() {
		return function() {
			return 'HOME123';
		};
	});

	this.config(function(config, db) {



	});

	this.service('injectedRouteHandler', function(inject) {
		return function(handler) {
			return function(req, res) {
				inject(handler, { req:req, res:res });
			};
		};
	});

	this.run(function(home, router, injectedRouteHandler) {

		router.get('/', injectedRouteHandler(function(home, res, db) {

			db.model('User').findAll().then(function(users) {
				res.json(users);
			})

		}));

	});

};



