'use strict';

var express = require('express');

var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var sessionMiddleware = require('express-session');
var serveFavicon = require('serve-favicon');

module.exports = function($q, $extend, $log, $is, $cwd, $configProvider, $path, $jade, $string) {


	var server = express();
	var http = require('http').Server(server);

	server.use(morgan('dev'));
	$log.verbose('Server is using morgan in dev mode');

	server.use(cookieParser());
	$log.verbose('Server is using cookie parser');


	server.use(bodyParser.urlencoded({ extended: false }));
	$log.verbose('Server is using bodyParser urlencoded (for application/x-www-form-urlencoded)');

	server.use(bodyParser.json());
	$log.verbose('Server is using bodyParser json (for application/json)');



	server.use(compression());
	$log.verbose('Server is using gzip compression');

	server.engine('.jade', $jade.__express);
	server.locals.basedir = $cwd;


	var favicon = $path.resolve( $cwd, $configProvider.get('server.favicon') || __dirname + '/$server/favicon.ico');
	server.use(serveFavicon(favicon));
	$log.verbose('Server is using favicon: ' + favicon);

	// Middleware queues -----------------------------------------------------
	var queues = {
		statics: [],
		parsers: [],
		middleware: [],
		interceptors: [],
		resolvers: [],
		routes: [],
		errors: []
	};


	function defineMiddleware(queue, method, routePath, handler) {
		queue.push([method, routePath, function(req, res, next) {
			req.$invoke(handler, { $next:next })
			.catch(function(err) {
				next(err);
			});
		}]);
	}

	function defineErrorMiddleware(queue, routePath, handler) {
		queue.push(['use', routePath, function(err, req, res, next) {

			$q.fcall(function() {
				return req.$invoke(handler, { $err:err });
			})
			.catch(function(err) {
				next(err);
			});

		}]);
	}


	this.serveStatic = function(obj) {
		var that = this;

		if( $is.array(obj) ) {
			obj.forEach(function(item)  {
				that.serveStatic(item);
			});
		}

		if( $is.string(obj) ) {
			this.serveStatic({ path: obj });
		}

		if( $is.object(obj) ) {
			queues.statics.push(['use', obj.route||'/', express.static( $path.resolve($cwd, obj.path)) ]);
		}

	};

	var staticFiles = $configProvider.get('server.statics');

	if(staticFiles) {
		this.serveStatic(staticFiles);
	}



	this.parser = function(method, route, handler) {
		$log.verbose( formatLog(route, method) + 'Parser' );
		defineMiddleware(queues.parsers, method, route, handler);
		return this;
	};

	this.middleware = function(method, route, handler) {
		$log.verbose( formatLog(route, method) + 'Middleware' );
		defineMiddleware(queues.middleware, method, route, handler);
		return this;
	};

	this.interceptor = function(method, route, handler) {
		$log.verbose( formatLog(route, method) + 'Interceptor' );
		defineMiddleware(queues.interceptors, method, route, handler);
		return this;
	};

	this.route = function(method, route, handler) {
		$log.verbose( formatLog(route, method) + 'Route' );
		defineMiddleware(queues.routes, method, route, handler );
		return this;
	};


	this.rawMiddleware = function(rawMiddleware) {
		$log.verbose('Using rawMiddleware: '+(rawMiddleware.name||'Unknown'));
		queues.middleware.push(['use', rawMiddleware]);
		return this;
	};

	this.middlewareCreator = function(creator) {
		queues.middleware.push(function($injector) {
			return $injector.invoke(creator).then(function(handler) {
				return ['use', handler];
			});
		});
		return this;
	};





	this.errorHandler = function(routePath, handler) {
		if(routePath && !handler) {
			handler = routePath;
			routePath = '/';
		}


		$log.verbose( formatLog(routePath) + 'Error-handler' );

		defineErrorMiddleware(queues.errors, routePath, handler);
		return this;
	};


	function formatLog(routePath, method) {
		method = $string(method||'all').toUpperCase().padRight(8, ' ').toString();
		return method.yellow + ((routePath || '/')+' ').green;
	}

	// RESOLVERS -------------------------------------------------------------
	var resolvers = {};
	this.resolver = function(name, resolver) {
		$log.verbose('Resolver registered: '+name.green);
		resolvers[name] = resolver;
		return this;
	};

	// Resolvers middleware registration
	queues.resolvers.push(['use', function(req, res, next) {
		var resolveInjector = req.$extendResolveInjector();

		Object.keys(resolvers).forEach(function(key) {
			resolveInjector.resolver(key, resolvers[key]);
		});

		next();
	}]);




	// SESSION -------------------------------------------------------------
	var session = {
		config:{
			secret: 'öalskdjföaijöasiölasjföijä48jfäaw4nfölafo48nfäa4bugäoab.kjb',
			resave: false,
			saveUninitialized: true,
			cookie: { secure: false }
		}
	};

	this.sessionStore = function(storeCreator) {
		session.storeCreator = storeCreator;
		return this;
	};

	this.sessionConfig = function(config) {
		$extend(true, session.config, config);
		return this;
	};

	// Create session middleware
	this.middlewareCreator(function($injector, $log) {
		var options = session.config;

		return $q.fcall(function() {

			if( $is.function( session.storeCreator ) ) {
				return $injector.invoke( session.storeCreator , { sessionMiddleware: sessionMiddleware })
					.then(function(store) {
						if(store) {
							options.store = store;
							$log.verbose('Using ' + store.constructor.name);
						} else {
							throw new Error('$serverProvider.sessionStore must return a store instance.');
						}
					});
			} else {
				$log.verbose('Using default session store');
			}

		})
		.then(function() {
			return sessionMiddleware(options);
		});
	});






	// SERVICE -------------------------------------------------------------
	this.$get = function($log, $q, $injector, $is, $config) {


		// Middleware which creates req.$invoke method
		// for injecting methods on with request locals
		server.use(function(req, res, next) {
			req.$locals = {
				$req: req,
				$res: res
			};

			/* Old $invoke
			var _locals = $extend(false, {}, req.$locals, locals_);
			return $injector.invoke(handler, _locals, scope);
			*/

			req.$injector = $injector.resolveInjector();

			req.$injector.provide('$req', req);
			req.$injector.provide('$res', res);

			req.$extendResolveInjector = function(instance) {
				req.$injector = instance || req.$injector.resolveInjector(req.$injector);
				return req.$injector;
			};

			req.$invoke = function(handler, locals_, scope) {
				return req.$injector.invoke.apply(null, arguments);
			};

			next();
		});



		function registerQueues() {



			function registerHandlers(arr, handlersName) {
				return $q.fcall(function() {
					var promises = [];

					arr.forEach(function(item) {

						if( $is.function(item) ) {
							promises.push( $injector.invoke(item) );
						}

						if( $is.array(item) ) {
							promises.push( $q.when(item) );
						}

					});

					return $q.all(promises).then(function(results) {
						var statCounter=0;

						results.forEach(function(item) {
							var method = item.shift();
							if(item[0] === null) {
								item.shift();
							}
							server[method].apply(server, item);
							statCounter++;
						});

						$log.verbose(statCounter + ' ' + handlersName + ' registered');
					});
				});
			}

			return registerHandlers(queues.statics, 'Static location(s)')
				.then(function() {
					return registerHandlers(queues.parsers, 'Parser(s)');
				})
				.then(function() {
					return registerHandlers(queues.middleware, 'Middleware handler(s)');
				})
				.then(function() {
					return registerHandlers(queues.interceptors, 'Interceptor(s)');
				})
				.then(function() {
					return registerHandlers(queues.resolvers, 'Resolve handler(s)');
				})
				.then(function() {
					return registerHandlers(queues.routes, 'Route(s)');
				})
				.then(function() {
					return registerHandlers(queues.errors, 'Error handler(s)');
				})
				.then(function() {
					server.use(function(err, req, res, next) {
						$log.error(err);

						res.status(err.status || 400)
						.json({
							name: 'UnknownError',
							message: 'Unknown error occurred.',
							status: (err.status || 400)
						});
					});
				});
		}



		return {
			server: server,
			http: http,
			start: function() {
				$log('Starting server');

				return registerQueues()
					.then(function() {
						return $q.promise(function(resolve, reject) {
							var serverInstance = http.listen($config.get('server.port') || 3000, function(err) {
								if(err) {
									return reject(err);
								}

								$log.success('Server running');
								resolve(serverInstance);
							});
						});
					});
			}
		};
	};

};
