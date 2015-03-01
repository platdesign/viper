'use strict';

var routeHandler = require('./routeHandler.js');


module.exports = function(routeDef, $routeProvider, $serverProvider, $extend, $is, $fs, $cwd, $q, $log, $errorsProvider, $path) {


	function $route($routes) {
		var route = this;
		$extend(true, this, routeDef);


		this.parents = function(method) {
			method = method || 'get';

			var routes = [];

			var tmpSegs = [];

			route.url.split('/').forEach(function(seg) {
				tmpSegs.push(seg);
				var routePath = tmpSegs.join('/') || '/';
				var route = $routes.getRoute(method, routePath);
				if(route) {
					routes.push(route);
				}
			});

			if(method === this.method) {
				routes.pop();
			}

			return routes;
		};

		this.parentsAndSelf = function(method) {

			var routes = this.parents(method);

			routes.push(this);

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
