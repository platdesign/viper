'use strict';

var Q = require('q');
var Sequelize = require('sequelize');

var viper = require('../');


var app = viper({
	sequelize: {
		db: {
			database: 'test',
			username: 'dev',
			password: 'dev',
			options: {
				logging: false
			}
		}
	},
	jsonApi: {
		backend: {

		}
	},
	mvc: {
		page: {

		}
	},
	session: {
		dbService: 'db'
	},
	account: {
		dbService: 'db',
		//baseRoute: '/account'
	}
});

/*
app.plugin( require('./plugins/session-sequelize.js') );
app.plugin( require('../../plugins/viper-plugin-sequelize') );
app.plugin( require('../../plugins/viper-plugin-jsonapi') );
app.plugin( require('../../plugins/viper-plugin-jade-mvc') );
app.plugin( require('../../plugins/viper-plugin-account-sequelize') );
*/


app.config(function($routeProvider, $serverProvider, $dbProvider) {


	$dbProvider.connect('db', function() {

	});

	$serverProvider
		.registerSessionStore(function(sessionMiddleware, $db) {
			var SequelizeStore = require('connect-sequelize')(sessionMiddleware);
			return new SequelizeStore($db.db);
		});

	$routeProvider
		.route({
			url: '/',
			//method: 'GET',
			//template: './views/test.jade',
			resolve: {
				test: function() {
					return 123;
				}
			},
			controller: function($scope, $account, test) {
				$scope.test = test;
				$scope.account = $account;
			},
			permissions: {
				only: ['authenticated']
			}

		})
		.route({
			url: '/test/:name',
			//method: 'GET',
			//template: './views/test.jade',
		})
	;

});

app.run(function($db, $log) {

});



app.bootstrap();




