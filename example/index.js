'use strict';

var path = require('path');

var viper = require('../');

var app = viper({
	//disabledPlugins: ['coreLogger'],
	plugins: {
		sequelize: {
			db: {
				database: 'piller',
				username: 'dev',
				password: 'dev',
				options: {
					logging: false
				},
				modelsDir: './models'
			}
		}
	},
	verbose: true
});

app.loadPluginFromPath( path.join('..', '..', 'plugins', 'viper-plugin-jade-mvc') );
app.loadPluginFromPath( path.join('..', '..', 'plugins', 'viper-plugin-sequelize') );

app.loadPluginFromPath('./plugin.js');

app.bootstrap();
