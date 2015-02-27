'use strict';


module.exports = function(roles) {
	return function routeEnterPermissionsHook($hook, $errors, $is, $req, $q) {
		var route = $hook.data;

		var permissionsInjector = $req.$injector.resolveInjector();

		var permissionsSuffix = 'Permissions';
		Object.keys(roles).forEach(function(key) {
			var roleResolver = roles[key];

			permissionsInjector.resolver(key+permissionsSuffix, roleResolver);

			permissionsInjector.resolver('!'+key+permissionsSuffix, function($injector) {
				return $injector.get(key+permissionsSuffix)
					.then(function(val) {
						return !!!val;
					})
					.catch(function() {
						return true;
					});
			});
		});

		var injector = $req.$injector.resolveInjector(permissionsInjector);


		function attrResolver(attr, permissions, route) {

			var $get = (permissions[attr]||[]).map(function(item) {
				return item+permissionsSuffix;
			});

			$get.push(function() {
				return Array.prototype.slice.call(arguments);
			});

			return injector.invoke($get)
				.then(function(resolver) {

					var results = [];
					resolver.forEach(function(status, i) {
						results.push(
							{
								name: permissions[attr][i],
								status: !!status,
								route: route,
								attr: attr
							}
						);
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
		route.withParents().reverse().every(function(item) {
			inheritParents.unshift(item);
			if(item.permissions && item.permissions.inherit === false) {
				return false;
			}
			return true;
		});


		var promises = [];
		inheritParents.map(function(item) {
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

				var message;

				if(result.attr === 'only') {
					message = 'Role '+result.name+' has to match';
				}
				if(result.attr === 'except') {
					message = 'Role '+result.name+' must not match';
				}

				throw new $errors.PermissionError(message, result.route);
			}
		});

	};

};

