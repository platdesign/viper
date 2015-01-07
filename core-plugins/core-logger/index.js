'use strict';

var morgan = require('morgan');

var plugin = module.exports = function coreLogger(viper) {

	var morganStyle;

	// Use pattern if given
	if(this.config.pattern) {
		morganStyle = this.config.pattern;
	} else {

	// Use pattern respectivley to the environment
		morganStyle = 'combined';
		switch( viper.env() ) {
			case 'production':
				morganStyle = 'combined';
			break;
			default:
			case 'development':
				morganStyle = 'dev';
			break;
		}
	}

	viper.router.use( morgan( morganStyle ) );
};

plugin.priority = 10;
