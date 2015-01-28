'use strict';

var extend = require('extend');
var express = require('express');
var DI = require('./DI.js');
var path = require('path');
var fs = require('fs');
var colors = require('colors');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var bodyParser = require('body-parser')
var Q = require('q');
var compression = require('compression');

/**
 * Export a litte helper to instantiate a new instance of viper
 */
module.exports = function(options){
	var instance = new Viper(options);
	return instance;
};

/**
 * Class
 * @param {[type]} options [description]
 */
function Viper(options) {
	this._inititalize(options);
}


/**
 * Default config
 * @type {Object}
 */
var defaultConfig = {
	port: 3000,
	configPath: './config'
};

var proto = {

	_inititalize: function(options) {
		var that = this;

		this._config = extend(true, defaultConfig, options);
		this._requireConfig();

		this._di = new DI();
		this._runStack = [];
		this._configStack = [];

		// Important to do it on the next tick
		setTimeout(function() {
			that.bootstrap();
		});
	},



	/**
	 * Bootstrap the application
	 * @return {[type]} [description]
	 */
	bootstrap: function() {
		var that = this;


		that._registerDefaultServices();
		that._registerDefaultPlugins();


		that._di.init();

		this._configStack.forEach(function(handler) {
			that._di.exec(handler, {}, that);
		});

		// call the runStack on next tick
		setTimeout(function() {
			that._runStack.forEach(function(handler) {
				that._di.exec(handler, {}, that);
			});
		});


		this._di.exec(function(app, config) {
			app.listen(config.port);
		});

	},


	/**
	 * Register a plugin-obj
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	plugin: function(obj) {
		obj.apply(this);
	},


	/**
	 * Register a run-method
	 * @param  {[type]} handler [description]
	 * @return {[type]}         [description]
	 */
	run: function(handler) {
		this._runStack.push(handler);
	},


	/**
	 * Register a config-method
	 * @param  {[type]} handler [description]
	 * @return {[type]}         [description]
	 */
	config: function(handler) {
		this._configStack.push(handler);
	},


	/**
	 * Register a service
	 * @param  {[type]} name    [description]
	 * @param  {[type]} service [description]
	 * @return {[type]}         [description]
	 */
	service: function(name, service) {
		return this._di.service(name, service);
	},

	/**
	 * Register a provider
	 * @param  {[type]} name     [description]
	 * @param  {[type]} provider [description]
	 * @return {[type]}          [description]
	 */
	provider: function(name, provider) {
		return this._di.provide(name, provider);
	},

	/**
	 * Register a service which returns always the given value
	 * @param  {string} name  [name of the service]
	 * @param  {object|string|function|array|...} value [value to provide]
	 * @return {[type]}       [description]
	 */
	value: function(name, value) {
		return this._di.value(name, value);
	},


	/**
	 * Registers some global services on di-instance during bootstrapping
	 */
	_registerDefaultServices: function() {
		var that = this;

		var app = express();
		app.use(morgan('dev'));
		app.use(compression());
		app.use(cookieParser());
		app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
		app.use(bodyParser.json());    // parse application/json

		this.value('app', app);

		this.provider('config', function() {

			var config = extend(false, {}, that._config);
			config.extend = function(options) {
				options = options || {};
				return extend(true, config, options);
			};

			return function() {
				return config;
			};

		});

		this.service('router', function(app) {
			var router = express.Router();
			app.use(router);
			return router;
		});


		this.service('inject', function() {
			return function(handler, locals, scope) {
				return that._di.exec(handler, locals, scope);
			};
		});

		this.value('extend', extend);
		this.value('fs', fs);
		this.value('path', path);
		this.value('Q', Q);

	},


	_registerDefaultPlugins: function() {

		this.plugin( require( path.join(__dirname, 'plugins', 'serveStatics' )));

	},



	/**
	 * Returns path to directory of main-module
	 * @return {string} [path to directory of main-module]
	 */
	cwd: function() {
		return path.dirname( require.main.filename );
	},

	/**
	 * Detect the environment
	 * @return {string} [name of environment the app is running in (default: development)]
	 */
	env: function() {
		return process.env.NODE_ENV || 'development';
	},





	/**
	 * Detects current environment and loads the right config-file from configPath (default: ./config)
	 * Then it extends the instances config with global and environment-based config attributes.
	 */
	_requireConfig: function() {
		// Detect environment
		var env = this.env();

		// Location of config-files
		var configPath = path.resolve( this.cwd(), this._config.configPath);

		// extend main-config
		extend(
			// deep extend
			true,

			// Main-config object as target
			this._config,

			// Load config/global.json|js
			loadConfigFile( path.join(configPath, 'global.json') ) || loadConfigFile( path.join(configPath, 'global.js') ) || {},

			//Load config/[development|production|...].json|js
			loadConfigFile( path.join(configPath, env+'.json') ) || loadConfigFile( path.join(configPath, env+'.js') ) || {}
		);
	},

};

extend(false, Viper.prototype, proto);






/**
 * Little helper to load config files and return them as objects if they exist.
 * @param  {string} filename [Path to json-file which should be parsed]
 * @return {object}          [Object with parsed config-data or empty object.]
 */
function loadConfigFile(filename) {

	if( fs.existsSync(filename) ) {
		return require(filename);
	}

}










