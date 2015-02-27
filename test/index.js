'use strict';

var describe = global.describe;
var it = global.it;
var before = global.before;
var expect = require("chai").expect;

var viper = require('../');


function hasMethod(obj, method) {
	it('has method: '+method, function(){
		expect(obj).to.have.property(method).that.is.a('function');
	});
}

function methodCanBeChained(obj, method, args) {
	it('method can chain: '+method+'()', function(){
		expect(obj[method].apply(obj, args)).that.deep.equals(obj);
	});
}
/*
describe('Viper', function() {


	describe('Instance api', function() {
		var app = viper();

		hasMethod(app, 'plugin');
		hasMethod(app, 'config');
		hasMethod(app, 'run');
		hasMethod(app, 'bootstrap');
		hasMethod(app, 'provider');
		hasMethod(app, 'service');
		hasMethod(app, 'factory');
		hasMethod(app, 'value');

		methodCanBeChained(app, 'plugin', [function(){}]);
		methodCanBeChained(app, 'config', [function(){}]);
		methodCanBeChained(app, 'provider', [function(){ this.$get = function() {}; }]);
		methodCanBeChained(app, 'service', [function(){ }]);
		methodCanBeChained(app, 'value', [null]);

	});


	describe('Instance bootstrapped', function() {

		var app = viper();



		var bootstraped;
		before(function() {
			bootstraped = app._bootstrap();
			return bootstraped;
		});

		it('successfully bootstrapped', function() {
			return bootstraped;
		});

		function testProvider(name, testHandler) {
			return app.di.getProvider(name)
			.then(function(provider) {

				var helper = {
					hasMethod: function(methodName) {
						return expect(provider).to.have.property(methodName).that.is.a('function');
					}
				};

				return testHandler(provider, helper);

			});
		}

		function hasMethod(name) {
			it('has method: '+name, function() {
				return testProvider('$errorsProvider', function(prov, helper){
					helper.hasMethod(name);
				});
			});
		}

		describe('$errorsProvider', function() {

			hasMethod('$get');
			hasMethod('createError');

		});




	});

});

*/
describe('Tools', function() {

	describe('Lib', function() {

		describe('is', function() {

			var is = require('../lib/tools/is.js');

			describe('api', function() {

				hasMethod(is, 'function');
				hasMethod(is, 'object');
				hasMethod(is, 'array');
				hasMethod(is, 'string');
				hasMethod(is, 'set');
				hasMethod(is, 'compareBooleanArrayWithAnd');
				hasMethod(is, 'compareBooleanArrayWithOr');

			});

			function testMethodValues(method, values, expctedValue) {
				expctedValue = expctedValue || false;

				values.forEach(function(item) {


					it(item[0]+' -> false', function() {
						return expect(is[method](item[1])).to.be[expctedValue];
					});

				});

			}

			var Const = function(){};

			describe('is.object', function() {

				testMethodValues('object', [
					['{}', {}],
				], true);

				testMethodValues('object', [
					['null', null],
					['[]', []],
					['function', function(){}],
					['String', 'a'],
					['Fn Instance', new Const()],
					['Number',2]
				]);

			});

			describe('is.array', function() {


				testMethodValues('array', [
					['[]', []],
				], true);

				testMethodValues('array', [
					['null', null],
					['{}', {}],
					['function', function(){}],
					['String', 'a'],
					['Fn Instance', new Const()],
					['Number',2]
				]);

			});

			describe('is.string', function() {

				testMethodValues('string', [
					['testString', 'testString'],
				], true);

				testMethodValues('string', [
					['null', null],
					['{}', {}],
					['function', function(){}],
					['Fn Instance', new Const()],
					['Number',2],
					['String', String]
				]);

			});




		});

	});

});

