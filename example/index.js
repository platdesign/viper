'use strict';


var viper = require('../');


var app = viper({
	sequelize: {
		db: {
			database: 'piller',
			username: 'dev',
			password: 'dev',
			options: {}
		}
	},
	jsonApi: {
		backend: {

		}
	}
});




//app.plugin( require('./plugins/test.js') );
app.plugin( require('./plugins/sequelize.js') );
app.plugin( require('../../plugins/viper-plugin-jsonapi') );
