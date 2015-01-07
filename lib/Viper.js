'use strict';

var fs		= require('fs');
var path 	= require('path');
var express = require('express');
var colors 	= require('colors');
var extend 	= require('extend');

var Plugin = require('./Plugin.js');






module.exports = function createInstance(options) {
	var instance = new Viper(options);
	return instance;
};




/**
 * [Mumbee description]
 * @param {[type]} config [description]
 */
function Viper() {
	this._initialize.apply(this, arguments);
};


// Default Mumbee config
var defaultConfig = {
	port: 3000,
	plugins: {}
};


// Prototype defines
var proto = {

	/**
	 * Initializes the new instance
	 * @param  {object} config [description]
	 * @return {[type]}        [description]
	 */
	_initialize: function(config) {

		this.config = extend(true, {}, defaultConfig, config || {});

		this._pluginsPaths = [];
		this.plugins = [];

		// Add path to core-plugins
		this.loadPluginsFromDir( path.join(__dirname, '..', 'core-plugins') );

	},


	/**
	 * [bootstrap description]
	 * @return {[type]} [description]
	 */
	bootstrap: function() {
		var that = this;

		// Create express app
		this.router = express();

		// Initialize plugins in correct order (sorted by priority)
		this._initPlugins();

		// Starting server
		that.log('Starting server ...');
		var server = this.server = this.router.listen(that.config.port, function() {
			that.log('... listening on port '+ server.address().port);
		});
	},


	/**
	 * [log description]
	 * @param  {[type]} msg [description]
	 * @return {[type]}     [description]
	 */
	log: function(msg) {
		console.log('Mumbee:'.yellow, msg);
	},




	/**
	 * [verboseLog description]
	 * @param  {[type]} msg [description]
	 * @return {[type]}     [description]
	 */
	verboseLog: function(msg) {
		if(this.config.verbose) {
			this.log(msg);
		}
	},



	/**
	 * Creates a plugin instance of a given object and pushes it to plugins-array
	 * @param  {object} obj [plugin-definition-object]
	 */
	_usePluginFromObj: function(obj) {
		var plugin = Plugin.create(obj);

		if(!plugin.name) {
			throw Error('Missing name in plugin object');
		}

		this.plugins.push(plugin);
	},


	/**
	 * Adds a plugin from given path
	 * @param  {string} pluginPath [absolute path to using plugin-file]
	 */
	loadPluginFromPath: function(pluginPath) {

		pluginPath = path.resolve(this.cwd(), pluginPath);

		if( fs.existsSync( pluginPath ) ) {
			var pluginObj = require( pluginPath );

			this._usePluginFromObj(pluginObj);
		}

	},


	/**
	 * Walks through 'dir' -> executes 'usePluginFromPath' for each item
	 * @param  {string} dir [Path to directory, where multiple plugins are located]
	 */
	loadPluginsFromDir: function(dir) {
		var that = this;

		dir = path.resolve(this.cwd(), dir);

		fs.readdirSync(dir).forEach(function(item) {
			var itemPath = path.join(dir, item);
			that.loadPluginFromPath( itemPath );
		});
	},








	/**
	 * Load plugin from node_modules of main-file
	 * @param  {string} moduleName [Name of npm-module]
	 */
	loadNpmPlugin: function(moduleName) {
		var pluginObj = require.main.require(moduleName);
		this._usePluginFromObj(pluginObj);
	},

	/**
	 * Load multiple plugins from node_modules of main-file
	 * @param  {array} moduleNamesArray [Array of npm-module-names (strings)]
	 */
	loadNpmPlugins: function(moduleNamesArray) {
		var that = this;
		moduleNamesArray.forEach( function(moduleName){
			that.loadNpmPlugin(moduleName);
		});
	},



	/**
	 * Detect the environment
	 * @return {string} [name of environment the app is running in (default: development)]
	 */
	env: function() {
		return process.env.NODE_ENV || 'development';
	},




	/** PLUGINS **/

	/**
	 * Private method to initialize loaded plugins in correct order.
	 */
	_initPlugins: function() {
		var that = this;

		function attachPlugin(plugin) {
			var pluginName = plugin.name;

			if( that.config.plugins[ pluginName ] ) {
				plugin._extendConfig(that.config.plugins[ pluginName ]);
			}

			that.verboseLog('Initialize plugin: '+pluginName.cyan);
			plugin.initialize(that);

		}



		// Sort plugins
		this.plugins = this.plugins.sort(function(a, b) {
			return a.priority - b.priority;
		});

		// Attach and initialize each plugin
		this.plugins.forEach(function(plugin) {
			attachPlugin(plugin);
		});

	},


	cwd: function() {
		return path.dirname( require.main.filename );
	}
};

// Extend Mumbee.prototype with protoMumbee
extend(true, Viper.prototype, proto);




