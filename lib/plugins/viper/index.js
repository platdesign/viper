'use strict';



var fs = require('fs');
var path = require('path');
var extend = require('extend');
var bcrypt = require('bcrypt');

var Q = require('../../tools/Q.js');
var is = require('../../tools/is.js');
var parse = require('../../tools/parse.js');
var jade = require('jade');
var _ = require('lodash');
var $string = require('string');
var routePathUtils = require('../../tools/routePathUtils.js');

module.exports = function() {
	var that = this;



	function providePlain(key, val) {
		that.di._providerInstances[key] = that.di._serviceInstances[key] = val;
	}

	providePlain('$$instance', that);
	providePlain('$q', Q);
	providePlain('$extend', extend);
	providePlain('$log', that.$log);
	providePlain('$constructorConfig', that.$constructorConfig);
	providePlain('$path', path);
	providePlain('$cwd', that.cwd());
	providePlain('$fs', fs);
	providePlain('$is', is);
	providePlain('$parse', parse);
	providePlain('$bcrypt', bcrypt);
	providePlain('$jade', jade);
	providePlain('_', _);
	providePlain('$string', $string);
	providePlain('$routePathUtils', routePathUtils);


	this.provider('$errors', require('./provider/$errors.js') );
	this.provider('$server', require('./provider/$server.js') );
	this.provider('$route', require('./provider/$route.js') );
	this.provider('$db', require('./provider/$db.js') );
	this.provider('$config', require('./provider/$config.js') );
	this.provider('$hooks', require('./provider/$hooks.js') );
	this.provider('$permissions', require('./provider/$permissions.js') );
	this.provider('$data', require('./provider/$data.js') );
	this.provider('$session', require('./provider/$session.js') );


	this.config( require('./configs/errors.js') );

	this.config( require('./configs/$data.js') );

	this.config( require('./configs/session.js') );



};
