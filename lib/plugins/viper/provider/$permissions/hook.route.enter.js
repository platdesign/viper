'use strict';


module.exports = function(roles) {
	return function routeEnterPermissionsHook($hook, $errors, $is, $req, $q, $log) {
		var route = $hook.data;

		var permissionsInjector = $req.$injector.resolveInjector();

		var permissionsSuffix = 'Permissions';
		Object.keys(roles).forEach(function(key) {

			var roleDef = roles[key];

			var roleResolverName = key+permissionsSuffix;


			var roleResolver = function($injector) {
				return $injector.invoke(roleDef.resolve)
				/*.catch(function(err) {
					$log.error(err);
					return false;
				})
				*/
				.then(function(status) {
					return {
						role: roleDef,
						status: !!status
					};
				});
			};


			var negationResolver = function($injector) {
				return $injector.get(roleResolverName)
					.then(function(obj) {
						obj.status = !!!obj.status;
						obj.negated = true;
						return obj;
					});
			};


			permissionsInjector.resolver(roleResolverName, roleResolver);
			permissionsInjector.resolver('!'+roleResolverName, negationResolver);

			if(roleDef.negatedName) {
				var roleResolverNegatedName = roleDef.negatedName+permissionsSuffix;
				permissionsInjector.resolver(roleResolverNegatedName, negationResolver);
			}

		});

		var injector = $req.$injector.resolveInjector(permissionsInjector);


		function attrResolver(attr, permissions, route) {

			var roles = permissions[attr]||[];

			if( $is.string(roles) ) {
				roles = [roles];
			}


			var $get = roles.map(function(item) {
				return item+permissionsSuffix;
			});

			$get.push(function() {
				return Array.prototype.slice.call(arguments);
			});

			return injector.invoke($get)
				.then(function(results) {

					results.forEach(function(result, i) {
						result.route = route;
						result.attr = attr;
						result.definedName = roles[i];
					});

					return results;
				});
		}

		function resultHandler(promises) {
			return $q.all(promises)
				.then(function(results) {
					var lastItem;
					results.every(function(val) {
						if(val) {
							lastItem = val;
							return val.status;
						} else {
							return true;
						}
					});
					return lastItem;
				});
		}

		function routeResolver(permissions, route) {
			var promises = [];

			promises.push(
				attrResolver('only', permissions, route)
				.then(function(results) {
					var lastItem;
					results.some(function(val) {
						if(val) {
							lastItem = val;
							return val.status;
						} else {
							return true;
						}
					});
					return lastItem;
				})
			);

			promises.push(
				attrResolver('except', permissions, route)
				.then(function(results) {
					var lastItem;
					results.every(function(val) {
						if(val) {
							lastItem = val;
							return !val.status;
						} else {
							return true;
						}
					});
					if(lastItem) {
						lastItem.status = !lastItem.status;
					}
					return lastItem;
				})
			);

			return resultHandler(promises);
		}




		var inheritParents = [];

		route.parentsAndSelf().reverse().every(function(item) {

			//console.log(item.url)

			inheritParents.unshift(item);
			if(item.permissions && item.permissions.inherit === false) {
				return false;
			}
			return true;
		});




		var promises = [];
		inheritParents.map(function(item) {

		//	console.log(item.url)

			if(item.permissions) {
				var per = item.permissions;

				promises.push(
					routeResolver(per, item.url)
				);
			}
		});

		return resultHandler(promises)
		.then(function(result) {
			if(result && result.status === false) {

				var role = result.role;

				// Create response message
				var message;
				if(result.attr === 'only') {
					if(result.negated) {
						message = role.negatedMessage || 'Required role: '+role.negatedName;
					} else {
						message = role.message || 'Required role: '+role.name;
					}
				}
				if(result.attr === 'except') {
					if(result.negated) {
						message = role.message || 'Rejected role: '+role.negatedName;
					} else {
						message = role.negatedMessage || 'Rejected role: '+role.name;
					}
				}

				throw new $errors.PermissionError(message, result.route);
			}
		});

	};

};

