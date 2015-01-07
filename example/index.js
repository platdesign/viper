'use strict';

var path = require('path');

var viper = require('../');

var app = viper({
	verbose: true
});

app.loadPluginFromPath( path.join(__dirname, '..', '..', 'plugins', 'viper-plugin-jade-mvc'));

app.bootstrap();
