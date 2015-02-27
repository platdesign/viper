'use strict';

var describe = global.describe;
var it = global.it;
var before = global.before;
var beforeEach = global.beforeEach;

var expect = require("chai").expect;

var viper = require('../');


var hasMethod = function(obj, name) {
	return expect(obj).to.have.property(name).that.is.a('function');
};

var testViper = function(handler) {

	describe('Viper', function() {

		handler({

			bootstrap: function(instance, handler) {


				describe('Booted Instance', function() {
					var promise;

					beforeEach(function() {
						if(!promise) {
							promise = instance.bootstrap();
						}

						return promise;
					});

					handler({
						hasMethod: function(name) {
							it('has Method: '+name, function() {
								return hasMethod(instance, name);
							});
							return this;
						},

						provider: function(name, handler) {
							describe('Provider: '+name, function() {

								var promise;

								beforeEach(function() {
									if(!promise) {
										promise = instance.di.getProvider(name);
									}

									return promise;
								});

								it('Exists', function() {
									return promise;
								});

								handler({
									hasMethod: function(name) {
										it('has Method: '+name, function() {

											return promise.then(function(provider) {
												return hasMethod(provider, name);
											});

										});
										return this;
									},

									it: function(desc, handler) {
										it(desc, function(done) {
											var isDone;
											var _done = function() {
												if(!isDone) {
													done.apply(null, arguments);
													isDone=true;
												}
											};

											return promise.then(function(provider) {
												return handler(provider, _done);
											})
											.then(_done, _done);
										});
									}
								});
							});
							return this;
						},


						service: function(name, handler) {
							describe('Service: '+name, function() {

								var promise;

								beforeEach(function() {
									if(!promise) {
										promise = instance.di.getService(name);
									}

									return promise;
								});


								it('Exists', function() {
									return promise;
								});

								handler({
									hasMethod: function(name) {
										it('has Method: '+name, function() {

											return promise.then(function(provider) {
												return hasMethod(provider, name);
											});

										});
										return this;
									},
									isObject: function() {
										it('is Object', function() {
											return promise.then(function(service) {
												return expect(service).to.be.an('object');
											});
										});
										return this;
									}
								});
							});
							return this;
						}
					});

				});

			}

		});

	});


};

testViper(function(tools) {

	var app = viper();

	tools.bootstrap(app, function(instance) {

		instance
			.hasMethod('plugin')
			.hasMethod('config')
			.hasMethod('run')
			.hasMethod('bootstrap')
			.hasMethod('provider')
			.hasMethod('service')
			.hasMethod('factory')
			.hasMethod('value')

			.provider('$errorsProvider', function(provider) {
				provider
					.hasMethod('$get')
					.hasMethod('createError')
					.it('1 === 1', function() {
						expect(1).equals(1);
					})
				;
			})

			.provider('$serverProvider', function(provider) {
				provider
					.hasMethod('$get')
					.hasMethod('route')
				;
			})

			.service('$errors', function(service) {
				service
					.isObject()
				;
			})

			.service('$server', function(service) {
				service
					.isObject()
					.hasMethod('start')
				;
			})

		;

	});




});
