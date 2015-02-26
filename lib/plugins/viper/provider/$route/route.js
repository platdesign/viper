'use strict';

module.exports = function(routeDef, $q, $log, $errorsProvider, $path, $cwd, $fs, $is, $extend, $serverProvider, $routeProvider) {


	routeDef.url = routeDef.url || '/';
	routeDef.method = (routeDef.method || 'get').toLowerCase();

	if(routeDef.template) {
		routeDef.template = $path.resolve($cwd, routeDef.template);
		if( !$fs.existsSync(routeDef.template) ) {
			throw new Error('Templatefile not found: '+routeDef.template);
		}
	}

	$routeProvider.routes[routeDef.url] = $routeProvider.routes[routeDef.url] || {};
	$routeProvider.routes[routeDef.url][routeDef.method] = routeDef;


	var handler = function($req, $res, $next, $injector) {
		var dontRender = false;

		var sendFile = $res.sendFile;
		$res.sendFile = function() {
			sendFile.apply(this, arguments);
			dontRender=true;
		};


		// $scope of this route
		var $scope = {};

		/**
		 * START Routehandling
		 */

		// Resolve all routeDef.resolver
		$q.fcall(function() {

			var resolveInjector = $req.$injector;

			var tmpSegments = [];
			var parentRoute = routeDef;

			routeDef.url.split('/').forEach(function(seg) {
				tmpSegments.push(seg);

				var routePath = tmpSegments.join('/') || '/';
				var routeObj = $routeProvider.routes[routePath];

				if(routeObj) {
					var route = routeObj[(parentRoute.resolveParentMethod || 'get')];

					if(route) {

						if( route.resolve ) {
							Object.keys(route.resolve).forEach(function(key) {
								var resolver = route.resolve[key];
								resolveInjector.resolver(key, resolver);
							});

							resolveInjector = $req.$resolveInjector(resolveInjector);
						}
						parentRoute = route;
					}
				}

			});

		})

		// Invoke controller
		.then(function() {

			if(routeDef.controller) {
				var locals = {};

				locals.$scope = $scope;
				locals.$setScope = function(newScope) { $scope = newScope; };

				return $req.$invoke( routeDef.controller, locals )
				.then(function(evtlScope) {
					if(evtlScope) {

						if( $is.function(evtlScope.toJSON) ) {
							$scope = evtlScope.toJSON();
						} else {
							$scope = evtlScope;
						}
					}

				});


			}
		})

		// Resolve scope if it's a promise
		.then(function() {
			return $q.when($scope);
		})

		// Resolve first-level keys of scope if it is an object
		.then(function($scope) {
			if( $is.object($scope) ) {
				return $q.promiseFromHash($scope);
			}
			return $scope;
		})

		/**
		 * Render route as:
		 * - invoke render method
		 * - json
		 * - template
		 */
		.then(function($scope) {

			if(dontRender !== true) {
				// Invoke render function
				if( $is.function(routeDef.render) ) {
					return invoke( routeDef.render, { $scope: $scope } );

				// Render scope as json
				} else if(routeDef.render === 'json' || !routeDef.template) {
					return $res.json($scope);

				// Render template with $scope
				} else if ( $is.string(routeDef.template) ) {
					return $res.render(routeDef.template, $scope );
				}
			}

		})

		// Catch Errors thrown up to this point
		.catch(function(err) {
			$next(err);
		});
	};




	var interceptor = function($req, $next, $injector, $extend) {
		$req.$locals.$route = routeDef;


		// routeDef interceptor
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
		.interceptor(routeDef.method, routeDef.url, interceptor)
		.route(routeDef.method, routeDef.url, handler)
	;




};
