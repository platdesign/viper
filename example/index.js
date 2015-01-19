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
	},
	mvc: {
		page: {

		}
	}
});


app.plugin( require('../../plugins/viper-plugin-sequelize') );
app.plugin( require('../../plugins/viper-plugin-jsonapi') );
app.plugin( require('../../plugins/viper-plugin-jade-mvc') );
