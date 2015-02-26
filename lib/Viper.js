'use strict';

var path = require('path');
var Q = require('q');
var DI = require('./tools/DI.js');
require('colors');

var Viper = function(config) {

	this.$log = $log;
	this.$constructorConfig = config || {};


	this.di = new DI();

	this._pluginBlocks = [];
	this._configBlocks = [];
	this._runBlocks = [];

	this.createInjector = DI.createInjector;

	this.plugin( require('./plugins/viper'), 99999 );

};

var proto = Viper.prototype;



function delegateToProvide (method) {
	return function() {
		this.di[method].apply(this.di, arguments);
	};
}

proto.provider 	= delegateToProvide('provider');
proto.factory 	= delegateToProvide('factory');
proto.service 	= delegateToProvide('service');
proto.value 	= delegateToProvide('value');


/**
 * Returns path to directory of main-module
 * @return {string} [path to directory of main-module]
 */
proto.cwd = function() {
	return path.dirname( require.main.filename );
};

/**
 * Detect the environment
 * @return {string} [name of environment the app is running in (default: development)]
 */
proto.env = function() {
	return process.env.NODE_ENV || 'development';
};



proto.plugin = function(fn, priority) {
	fn.priority = fn.priority || priority || 100;
	this._pluginBlocks.push(fn);
};

proto.config = function(fn) {
	this._configBlocks.push(fn);
};

proto.run = function(fn) {
	this._runBlocks.push(fn);
};



proto.bootstrap = function() {
	var that = this;

	that.$log('Bootstrapping');



	this._invokePlugins()

	.then(function() {
		return that._runConfigBlocks();
	})
	.then(function() {
		return that._runRunBlocks();
	})
	.then(function() {
		// Starting the server
		return that.di.serviceInjector.invoke(function($server, $route) {
			return $server.start();
		});
	})
	.then(function(server) {
		that.$log.success('Application successfully bootstrapped! =)');
	})
	.catch(function(err) {
		that.$log.error(err);
		process.exit(1);
	});


};


proto._invokePlugins = function() {
	var that = this;

	return Q.fcall(function() {

		that.$log('Loading plugins');

		that._pluginBlocks.sort(function(a, b){
			return b.priority - a.priority;
		}).forEach(function(fn) {
			fn.apply(that);
		});

		that.$log.success('Plugins loaded');

	});
};

proto._runConfigBlocks = function() {
	var that = this;

	that.$log('Starting configuration');

	// Call config methods
	return this._configBlocks.reduce(function (soFar, handler) {
		return Q.when(soFar).then(function() {
			return that.di.providerInjector.invoke(handler, {}, that);
		});

	}, Q(true))

	.then(function() {
		that.$log.success('Configuration succeeded');
	});
};


proto._runRunBlocks = function() {
	var that = this;

	that.$log('Starting runners');

	// Call run methods
	return this._runBlocks.reduce(function (soFar, handler) {
		return Q.when(soFar).then(function() {
			//that.logVerbose('Executing run handler'.yellow);
			return that.di.serviceInjector.invoke(handler, {}, that);
		});
	}, Q(true))

	.then(function() {
		that.$log.success('Runners succeeded');
	});
};






module.exports = function(config) {
	return new Viper(config);
};




var $log = function(msg) {
	console.log('▶ '.cyan, msg);
};
$log.error = function(err) {

	if(err.stack) {
		console.log('✗ '.red, err.stack);
	} else {
		var msg = err.message || err.toString();
		console.log('✗ '.red, msg);
	}
};
$log.success = function(msg) {
	console.log('✔ '.green, msg);
};
$log.verbose = function(msg) {
	console.log('Verbose:'.cyan, msg);
};

$log.debug = function(msg) {
	console.log(' Debug: '.magenta.bgYellow, msg);
};


