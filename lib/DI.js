'use strict';


var Q = require('q');

var DI = module.exports = function() {
	this._init();
};


var proto = DI.prototype;

proto._init = function() {
	this.providers = {};
	this._providerHandler = {};
};

proto.provide = function(name, handler) {
	this._providerHandler[name] = handler;
};

proto.service = function(name, handler) {
	this.provide(name, function() {
		return handler;
	});
};

proto.value = function(name, value) {
	this.service(name, function(){
		return value;
	});
};



proto.exec = function(handler, locals, scope) {
	var that = this;
	locals = locals || {};
	var providers = this.providers;

	var params = this.getFnParams(handler);

	var args = [];

	params.forEach(function(providerName) {

		if(locals[providerName]) {
			args.push(locals[providerName]);
		} else if (providers[providerName]) {

			var service = providers[providerName];

			var servicePromise = that.exec(service);

			args.push(servicePromise);
		} else {
			args.push(null);
			throw Error('Provider ('+providerName + ') not found!');
		}
	});

	return Q.allSettled(args).then(function(results) {
		var args = [];
		results.forEach(function(result) {
			args.push(result.value);
		});

		return handler.apply(scope || handler, args);
	});

};

proto.getFnParams = function(func) {
	var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var PARAMS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

	// Remove comments
	var hString = func.toString().replace(COMMENTS, '');

	// Match params
	var args = hString.match(PARAMS);

	// Sanitize signature
	if (args) {
		hString = 'function(' + (args[1] || '').replace(/[\s\r\n]+/, ' ') + ')';
	} else {
		hString = 'function()';
	}

	// return array of parameters
	return PARAMS.exec(hString)[1].split(/\s*,\s*/).filter(function (param) {
		return param;
	});
};


proto.init = function() {
	var that = this;
	var handlers = this._providerHandler;

	Object.keys(handlers).forEach(function(providerName) {
		var providerHandler = handlers[providerName];

		that.providers[providerName] = providerHandler.apply(providerHandler);
	});

};
