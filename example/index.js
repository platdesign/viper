'use strict';

var viper = require('../');


var app = viper();




app.config(function($routeProvider, $q, $serverProvider) {

	$serverProvider.resolver('$account', function() {
		return 'account';
	});

	$routeProvider
		.route({
			url: '/',
			resolve: {
				_firstResolver: function() {
					return 'First Resolver';
				}
			}
		})
		.route({
			url: '/:test',
			resolve: {
				_secondResolver:function(_firstResolver, $req, $account){
					return {
						_firstResolver: _firstResolver,
						_secondResolver: $req.params.test,
						$account: $account
					};
				},
				_thirdResolver:function(_secondResolver) {
					_secondResolver._thirdResolver = '123';
					return _secondResolver;
				}
			},
			controller: function(_thirdResolver) {
				return _thirdResolver
			}
		})
		.route({
			url: '/:test/a',
			resolve: {
				_finally: function (_thirdResolver) {
					console.log('called _finally');
					return _thirdResolver;
				}
			},
			controller: function(_finally, $req) {
				console.log('called controller');
				//return _finally
				return _finally;
			}
		})
	;

});



app.bootstrap();




