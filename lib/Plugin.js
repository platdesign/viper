'use strict';

var extend = require('extend');

/**
 * [Plugin description]
 */
function Plugin() {
	this.priority = 1000;
	this.config = {};
	this.interface = {};
}

module.exports = Plugin;

/**
 * Create instance of Plugin extended by given object
 * @param  {object} obj [plugin-definition]
 * @return {plugin}     [instance of extended plugin]
 */
Plugin.create = function(obj) {
	var instance = new Plugin();

	instance = extend(true, instance, obj);
	instance.name = obj.name;
	instance.initialize = function() {
		obj.prototype.constructor.apply(instance, arguments);
	};
	return instance;
};

var proto = Plugin.prototype;

/**
 * Extend instances config
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
proto._extendConfig = function(config) {
	extend(true, this.config, config);
};



proto.logError = function(msg) {
	console.log(('Plugin-Error ('+this.name+'): ').red + msg);
};


proto.log = function(msg) {
	console.log(('Plugin ('+this.name+'): ') + msg);
};




