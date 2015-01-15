'use strict';

var Sequelize 	= require('sequelize');
var fs 			= require('fs');
var path 		= require('path');

module.exports = function() {
	var that = this;

	if( this._config.sequelize ) {

		var config = this._config.sequelize;

		// Walk config and create connection-provider for each item
		Object.keys(config).forEach(function(serviceName) {

			// config args
			var args = config[serviceName];


			// Create provider for connection
			that.provider(serviceName, function() {
				// create connection
				var con = new Sequelize(args.database, args.username, args.password, args.options || {});

				// connect to database
				con.authenticate().then(function() {
					console.log(('Connection ('+serviceName+') has been established successfully.').cyan);

					// Import models from modelPath
					var modelsPath = path.resolve( that.cwd(), args.modelsPath || './models');

					if( fs.existsSync(modelsPath) ) {
						fs.readdirSync(modelsPath).forEach(function(item) {
							var itemPath = path.join(modelsPath, item);
							con.import(itemPath);
						});
					}

				}, function(err) {
					// Output error
					console.log(err);
				});

				// return service function which returns connection-object
				return function() {
					return con;
				};
			});


		});

	}

};
