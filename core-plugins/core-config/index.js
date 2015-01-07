'use strict';

var path 		= require('path');
var fs 			= require('fs');
var extend 		= require('extend');

/**
 * Detects config-files by environment and attaches their data to main-config
 * @param  {object} viper [Instance of viper]
 */
var plugin = module.exports = function coreConfig(viper) {

	// Detect environment
	var env = viper.env();

	// Location of config-files
	var configPath = path.resolve( viper.cwd(), this.config.path );

	// extend main-config
	extend(
		// deep extend
		true,

		// Main-config object as target
		viper.config,

		// Load config/global.json
		loadConfigFile( path.join(configPath, 'global.json') ),

		//Load config/[development|production|...].json
		loadConfigFile( path.join(configPath, env+'.json') )
	);

};

// Very low priority to ensure early execution
plugin.priority = 5;

// Default config values. Can be configured in Mumbee-constructor-config-object
plugin.config = {
	path: './config'
};



/**
 * Little helper to load config files and return them as objects
 * @param  {string} filename [Path to json-file which should be parsed]
 * @return {object}          [Object with parsed config-data or empty object.]
 */
function loadConfigFile(filename) {
	if( fs.existsSync(filename) ) {
		return JSON.parse( fs.readFileSync( filename, 'utf-8') );
	} else {
		return {};
	}
}


plugin.name = path.basename(__dirname);
