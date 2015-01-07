'use strict';

var path = require('path');

var viper = require('../');

var app = viper({
	verbose: true
});

app.loadPluginFromPath( path.join('..', '..', 'plugins', 'viper-plugin-jade-mvc') );

app.bootstrap();
