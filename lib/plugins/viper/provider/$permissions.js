'use strict';

module.exports = function($hooksProvider, $injector) {

	var roles = {};

	// Register route:ender hook
	$hooksProvider.registerHook('route:enter', require('./$permissions/hook.route.enter.js')(roles));

	// define roles
	this.defineRole = function(name, resolver) {
		roles[name] = resolver;
		return this;
	};

	this.$get = function() {
		return {
			roles: roles,
			defineRole: function(name, resolver) {
				roles[name] = resolver;
				return this;
			}
		};
	};

};
