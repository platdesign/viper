'use strict';


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


app.plugin( require('./plugins/session-sequelize.js') );
app.plugin( require('../../plugins/viper-plugin-sequelize') );
app.plugin( require('../../plugins/viper-plugin-jsonapi') );
app.plugin( require('../../plugins/viper-plugin-jade-mvc') );
app.plugin( require('../../plugins/viper-plugin-account-sequelize') );

