'use strict';


var passport = require('passport');
var LocalStrategy = require('passport-local');
var extend = require('extend');

var defaults = {
	configId: 'account'
};


var configDefaults = {

};


module.exports = function() {



	if( this._config[defaults.configId] ) {
		var config = extend(true, {}, configDefaults, this._config[defaults.configId]);


		this.config(function(app, inject) {

			app.use(passport.initialize());
  			app.use(passport.session());

			inject(config.getModel)
			.then(function(Model) {

				passport.serializeUser(function(user, done) {
					done(null, user.id);
				});

				passport.deserializeUser(function(id, done) {
					Model.findById(id).then(function(user){
						done(null, user);
					}, function(err) {
						done(err);
					});
				});

			}, function(err) {
				console.log(err);
			});

		});


		this.run(function(router, inject) {

			router.post('/auth/login', function(req, res, next) {

				inject(config.getModel)
				.then(function(Model) {

					Model.login(req.body.email, req.body.password)
					.then(function(user) {
						req.logIn(user, function(err) {
							if (err) { return next(err); }
							res.json(user);
						});
					}, function(err) {
						res.json({
							error:{
								message: err.message
							}
						});
					});

				});

			});


			router.post('/auth/logout', function(req, res) {
				req.logout();
				res.json(true);
			});

			router.post('/auth/register', function(req, res) {

				var username = req.body.username;
				var email = req.body.email;
				var password = req.body.password;

				inject(config.getModel)
				.then(function(Model) {

					Model.register(username, email, password)
					.then(function(user) {
						req.logIn(user, function(err) {
							if (err) { return next(err); }
							res.json(user);
						});
					}, function(err) {
						res.json(err);
					});

				});

			});
		});

	}




};
