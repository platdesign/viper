'use strict';

module.exports = function routeHandler($req, $res, $next, $route, $q, $is, $hooks, $routes, $errors) {
	var routeDef = $route;

	// $scope of this route
	var $scope = {};



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




	return $q.fcall(function() {

		if($route.abstract) {
			throw new $errors.ResponseError(404, 'Not found');
		}

		return $hooks.execute('route:enter', $route, {}, null, resolveInjector);
	})

	// Invoke controller
	.then(function() {
		if(routeDef.controller) {
			return $req.$invoke( routeDef.controller, { $scope: $scope } );
		}
	})

	.then(function(evtlScope) {
		if(evtlScope) {
			if( $is.function(evtlScope.toJSON) ) {
				$scope = evtlScope.toJSON();
			} else {
				$scope = evtlScope;
			}
		}
		return $q.when($scope);
	})

	/**
	 * Render route as:
	 * - invoke render method
	 * - json
	 * - template
	 */
	.then(function($scope) {

		// Invoke render function
		if( $is.function(routeDef.render) ) {
			return $req.$invoke( routeDef.render, { $scope: $scope } );

		// Render scope as json
		} else if(routeDef.render === 'json' || !routeDef.template) {
			return $res.json($scope);

		// Render template with $scope
		} else if ( $is.string(routeDef.template) ) {
			return $res.render(routeDef.template, $scope );
		}

	})

	// Catch Errors thrown up to this point
	.catch(function(err) {
		$next(err);
	});
};
