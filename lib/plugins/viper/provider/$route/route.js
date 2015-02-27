'use strict';

var routeHandler = require('./routeHandler.js');


module.exports = function(routeDef, $routeProvider, $serverProvider, $extend, $is, $fs, $cwd, $q, $log, $errorsProvider, $path) {


	function $route($routes) {
		var route = this;
		$extend(true, this, routeDef);


		this.parents = function(method) {
			var routes = [];

			var tmpSegs = [];

			route.url.split('/').forEach(function(seg) {
				tmpSegs.push(seg);
				var routePath = tmpSegs.join('/') || '/';
				var route = $routes.getRoute(method||'get', routePath);
				if(route) {
					routes.push(route);
				}
			});
			routes.pop();
			return routes;
		};

		this.withParents = function(method) {
			var routes = [];

			var tmpSegs = [];

			route.url.split('/').forEach(function(seg) {
				tmpSegs.push(seg);
				var routePath = tmpSegs.join('/') || '/';
				var route = $routes.getRoute(method||'get', routePath);
				if(route) {
					routes.push(route);
				}
			});
			return routes;
		};
	}

	routeDef.url 	= routeDef.url || '/';
	routeDef.method = (routeDef.method || 'get').toLowerCase();

	if(routeDef.template) {
		routeDef.template = $path.resolve($cwd, routeDef.template);
		if( !$fs.existsSync(routeDef.template) ) {
			throw new Error('Templatefile not found: '+routeDef.template);
		}
	}

	// Check if routeDef already exists
	var existingRouteDef = $routeProvider.getRoute(routeDef.method, routeDef.url);

	if(existingRouteDef) {
		$extend(true, existingRouteDef, routeDef);
	} else {
		$routeProvider.routes.push(routeDef);



		var parser = function($req, $next, $routes) {
			// Add $route to $injector
			$req.$injector.provide('$route', $req.$injector.instantiate($route));

			// Add resolver to $injector
			var resolveInjector = $req.$injector;

			var tmpSegments = [];

			routeDef.url.split('/').forEach(function(seg) {
				tmpSegments.push(seg);

				var routePath = tmpSegments.join('/') || '/';

				var route = $routes.getRoute('get', routePath);

				if(route && route.resolve) {
					Object.keys(route.resolve).forEach(function(key) {
						var r = route.resolve[key];
						resolveInjector.resolver(key, r);
					});
				}

				resolveInjector = $req.$extendResolveInjector(resolveInjector);
			});

			// execute routeDef interceptor
			if(routeDef.interceptor) {
				$req.$invoke(routeDef.interceptor, {}, routeDef)
				.then(function() {
					$next();
				})
				.catch(function(err) {
					$next(err);
				});
			} else {
				$next();
			}
		};

		$serverProvider
			.parser(routeDef.method, routeDef.url, parser)
			.route(routeDef.method, routeDef.url, routeHandler)
		;

	}

	return routeDef;

};
