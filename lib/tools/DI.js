'use strict';

var Q = require('q');

var providerSuffix = 'Provider';

function isObject(obj) {
	return (!!obj) && (obj.constructor === Object);
}

function supportObject(delegate) {
	return function(key, value) {
		if (isObject(key)) {
			Object.keys(key).forEach(function(k) {
				delegate(k, key[k]);
			});
		} else {
			return delegate(key, value);
		}
	};
}

function getFnParams (func) {

	var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var PARAMS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

	// remove whitespace
	var fnString = func.toString().replace(/\s/mg, '');

	// Remove comments
	fnString = fnString.replace(COMMENTS, '');

	// Match params
	var args = fnString.match(PARAMS);

	// Sanitize signature
	if (args) {
		fnString = 'function(' + (args[1] || '').replace(/[\s\r\n]+/, ' ') + ')';
	} else {
		fnString = 'function()';
	}

	// return array of parameters
	return PARAMS.exec(fnString)[1].split(/\s*,\s*/).filter(function (param) {
		return param;
	});
}

function annotate(fn) {
	var args;

	if( Array.isArray(fn) ) {
		args = fn.slice(0, fn.length-1);
	} else {
		args = getFnParams(fn);
	}

	return args;
}


var diErr = function(msg) {
	return new Error(msg);
};

var __multiPromiseValues = function(results) {

	var args = [];
	results.forEach(function(result) {

		if(result.state === 'fulfilled') {
			args.push(result.value);
		} else {
			throw result.reason;
		}

	});

	return args;
};

var __fn2promisedArgs = function(fn, locals, factory) {
	var params = annotate(fn);



	var args = [];

	params.forEach(function(key) {
		args.push( Q.when( locals && locals.hasOwnProperty(key) ? locals[key] : factory(key) ) );
	});

	return args;
};

function _invoke(fn, locals, scope, factory) {

	var args = __fn2promisedArgs(fn, locals, factory);

	if( Array.isArray(fn) ) {
		fn = fn[fn.length-1];
	}

	return Q.allSettled(args)
	.then(__multiPromiseValues)
	.then(function(args) {
		return fn.apply(scope || fn, args);
	});

};


function _instantiate(fn, locals, factory) {

	var args = __fn2promisedArgs(fn, locals, factory);

	if( Array.isArray(fn) ) {
		fn = fn[fn.length-1];
	}

	return Q.allSettled(args)
	.then(__multiPromiseValues)
	.then(function(args) {

		var instance = new (fn.bind.apply(fn, [null].concat(args)))();
		return instance;

	});

};



module.exports = function() {
	return new DI();
}

var DI = function() {
	var that = this;

	this._providerConstructors = {};
	this._providerInstances = {};
	this._serviceInstances = {};


	function injector(method) {
		var inj = {
			invoke: function(fn, locals, scope) {
				locals = locals || {};
				locals.$injector = inj;
				return _invoke(fn, locals, scope, function(name) {
					return that[method](name);
				});
			},
			instantiate: function(fn, locals) {
				locals = locals || {};
				locals.$injector = inj;
				return _instantiate(fn, locals, function(name) {
					return that[method](name);
				});
			}
		};
		return inj;
	}


	this.providerInjector = injector('getProvider');
	this.serviceInjector = injector('getService');
};

var proto = DI.prototype;


proto.provider = function(name, fn) {
	name = name + providerSuffix;
	if(this._providerConstructors.hasOwnProperty(name)) {
		throw diErr('Provider '+name+' already exists.');
	}
	this._providerConstructors[name] = fn;
};

proto.factory = function(name, fn) {
	this.provider(name, function() {
		this.$get = fn;
	});
};

proto.service = function(name, constructor) {
	this.factory(name, function($injector) {
		return $injector.instantiate(constructor);
	});
};

proto.value = function(name, value) {
	this.factory(name, function() {
		return value;
	});
};

proto.getProvider = function(name) {
	var that = this;

	return Q.fcall(function() {
		if(that._providerInstances.hasOwnProperty(name)) {
			return that._providerInstances[name];
		} else if(that._providerConstructors.hasOwnProperty(name)) {

			return that._providerInstances[name] = that.providerInjector.instantiate( that._providerConstructors[name], {}, function(name) {

				return that.getProvider(name);

			} ).then(function(providerInstance) {
				that._providerInstances[name] = providerInstance;
				return providerInstance;
			});

		} else {
			throw diErr('Provider \''+name+'\' not found');
		}
	});

};

proto.getService = function(name) {
	var that = this;

	return Q.fcall(function() {
		if(that._serviceInstances.hasOwnProperty(name)) {
			return that._serviceInstances[name];
		} else {
			return that.getProvider(name+providerSuffix).then(function(provider) {

				if(!provider.hasOwnProperty('$get')) {
					throw diErr('Provider '+name +' needs a $get attribute!');
				} else {
					return that.serviceInjector.invoke(provider.$get, {}, null, function(name) {
						return that.getService(name);
					})
					.then(function(instance) {
						that._serviceInstances[name] = instance;
						return instance;
					});
				}

			});
		}
	});

};


