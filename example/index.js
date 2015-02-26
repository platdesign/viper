'use strict';

var viper = require('../');


var app = viper();



app.config(function($routeProvider, $q) {

	$routeProvider
		.route({
			name: 'home',
			url: '/',
			resolve: {
				_test: function() {
					return $q.delay(200).then(function(){ return 123; });
				}
			}
		})
		.route({
			name: 'home.test',
			url: '/test',
			resolveParent: true,
			resolve: {
				_test:function(_test){
					console.log(_test)
					return $q.delay(200).then(function(){ return 345; });
				},
				_qweqwe:function(_test) {
					return $q.delay(200).then(function(){ return _test; });
				}
			},
			controller: function(_test) {
			}
		})
		.route({
			name: 'home.test.a',
			url: '/test/a',
			resolveParent: true,
			resolve: {
				_finally: function(_qweqwe) {
					//return 123;
					return $q.delay(0).then(function(){ return _qweqwe; });
				}
			},
			controller: function(_finally) {
				//return _finally
				return $q.delay(0).then(function(){ return _finally; });
			}
		})
	;

});



app.bootstrap();




