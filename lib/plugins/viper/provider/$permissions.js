'use strict';

module.exports = function($hooksProvider, $injector, $is, $string) {

	var roles = {};

	// Register route:ender hook
	$hooksProvider.registerHook('route:enter', require('./$permissions/hook.route.enter.js')(roles));


	function registerRoleDef(name, role) {

		if(!name) {
			throw new Error('Role needs a name!');
		}

		role.name = name;

		if(!role.resolve) {
			throw new Error('Role '+name+' needs a resolve handler');
		}

		if(!role.negatedName) {
			// camelized negatedName = not+role.name
			// hasCat -> notHasCat
			role.negatedName = $string('not-'+role.name).camelize().toString();
		}

		roles[name] = role;
	}

	// define roles
	this.defineRole = function(name, roleResolve, roleDef) {

		// Allow first parameter to be a roleDef Object
		if($is.object(name)) {

			registerRoleDef(name.name, name);

		} else if($is.string(name)) {

			// Allow secont parameter to be a role.resolve function
			if($is.function(roleResolve)) {

				// Allow third parameter to be a roleDef Object
				roleDef = roleDef || {};

				roleDef.resolve = roleResolve;
				registerRoleDef(name, roleDef);

			}

			// Allow secont parameter to be a roleDef Object
			if($is.object(roleResolve)) {
				registerRoleDef(name, roleResolve);
			}

		}

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
