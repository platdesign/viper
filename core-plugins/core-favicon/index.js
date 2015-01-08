'use strict';

var serveFavicon = require('serve-favicon');
var path = require('path');


var plugin = module.exports = function coreFavicon(viper) {

	var iconPath = path.resolve( viper.cwd(), this.config.path );

	viper.router.use( serveFavicon(iconPath, this.config.options) );
};

plugin.priority = 100;


plugin.config = {
	path: path.join(__dirname, 'favicon.ico'),
	options: {

	}
};
