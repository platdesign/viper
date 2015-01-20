'use strict';

var session = require('express-session');
var SequelizeStore = require('connect-sequelize')(session);
var extend = require('extend');

var defaults = {
	configId: 'session'
};


var configDefaults = {
	resave: false,
	saveUninitialized: true,
	secret: 'asdhlalskdfblaizdvflkahbsdlfkhb'
};



module.exports = function() {


	if( this._config[defaults.configId] ) {
		var config = extend(true, {}, configDefaults, this._config[defaults.configId]);


		this.config(function(router, inject) {

			if( config.dbService ) {
				var dbGetter = new Function(config.dbService, 'return arguments[0];');

				inject(dbGetter)
				.then(function(db) {
					config.store = new SequelizeStore(db);

					router.use(session(config));

				});
			} else {
				router.use(session(config));
			}



		});

	}

}
