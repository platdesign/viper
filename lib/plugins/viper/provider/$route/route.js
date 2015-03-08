'use strict';

var routeHandler = require('./routeHandler.js');


module.exports = function($routePathUtils, routeDef, $routeProvider, $serverProvider, $extend, $is, $fs, $cwd, $q, $log, $errorsProvider, $path) {


	function $route($routes) {
		var route = this;
		$extend(true, this, routeDef);


		this.parentsAndSelf = function(method) {
			method = (method || 'GET').toLowerCase();

			var routeStrings = $routePathUtils.getSegmentsPaths(this.url);

			var routes = [];
			routeStrings.forEach(function(routePath, i) {
				var _method;
				if(routePath === route.url) {
					_method = route.method;
				}

				var _route = $routes.getRoute(_method || method, routePath);

				if(_route) {
					routes.push(_route);
				}

			});

			return routes;
		};

		this.parents = function(method) {
			var routes = this.parentsAndSelf(method);

			routes.pop();

			return routes;
		};
	}

	// remove trailling slashes
	routeDef.url = routeDef.url.replace(/\/+$/, '');

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



		var parser = function($req, $next) {
			// Add $route to $injector
			$req.$injector.provide('$route', $req.$injector.instantiate($route));

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
