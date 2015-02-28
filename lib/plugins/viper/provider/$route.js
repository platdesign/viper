'use strict';


module.exports = function(
		$serverProvider,
		$errorsProvider,
		$injector,
		$log,
		$q,
		$path,
		$cwd,
		$fs,
		$is,
		$_configAsync
	) {

	var provider = this;

	provider.routes = [];


	provider.routes.getRoute = function(method, url) {
		return provider.routes.filter(function(route) {
			return route.url === url && route.method === method;
		})[0];
	};

	provider.getRoute = provider.routes.getRoute;


	$injector.provide('$routesProvider', { $get: function() {
		return provider.routes;
	}});


	function registerRoute(routeDef, parentUrl) {

		parentUrl = parentUrl || '/';
		routeDef.url = routeDef.url || '/';
		routeDef.url = (parentUrl==='/'?'':parentUrl) + routeDef.url;

		$_configAsync(function() {
			return $injector.invoke(require('./$route/route.js'), {
				routeDef: routeDef
			})
			.then(function(routeDef) {
				if(routeDef.routes) {
					provider.route(routeDef.routes, routeDef.url);
					delete routeDef.routes;
				}
			})
			.catch(function(err) {
				$log.error(err);
			});
		});

	}


	this.route = function(routeDef, parentUrl) {
		if($is.array( routeDef )) {
			routeDef.forEach(function(def) {
				provider.route(def, parentUrl);
			});
		} else if( $is.object(routeDef) ) {
			registerRoute(routeDef, parentUrl);
		}

		return this;
	};

	$serverProvider.errorHandler(require('./$route/errorHandler.js'));


	this.$get = function() {
		throw new Error('$route is only available in route handlers');
	};

};
