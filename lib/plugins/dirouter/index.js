'use strict';

var express = require('express');
var glob = require('glob');

module.exports = function () {

	this.service('diRouteHandler', function(inject) {

		return function(handler, locals, success, error) {
			locals = locals || {};
			return function(req, res, next) {

				locals.req = req;
				locals.res = res;
				locals.next = next;
				locals.params = req.params;

				var res = inject(handler, locals);

				if(success) {
					res.then(function(res) {
						success(res);
					});
				}

				if(error) {
					res.catch(function(res) {
						error(res);
					});
				}

			};
		};

	});

	this.service('diRouter', function(Router, diRouteHandler){

		return function() {
			var router = new Router();

			function createHandler(method) {
				var orig = router[method];
				router[method] = function(path, handler, locals, success, error) {
					orig.apply(router, [path, diRouteHandler(handler, locals, success, error)]);
				};
			}

			createHandler('get');
			createHandler('post');
			createHandler('put');
			createHandler('delete');
			createHandler('all');

			return router;
		};

	});

	this.service('diRouterFromDir', function(diRouter, path){

		return function diRoutesFromDir(dir, handleHandler) {

			var r = diRouter();

			glob.sync( path.join(dir, '**', '*.js') )
			.sort(function(a, b) {
				return b.split('/').length - a.split('/').length;
			})
			.forEach(function(item) {

				var mod = require(item);
				var dirname = path.dirname(item);
				var baseRoute = dirname.substr(dir.length);

				baseRoute = baseRoute.replace(/\/-([\w]*?)/g, '/:$1');

				Object.keys(mod).forEach(function(key) {

					var handle = mod[key];
						handle.method = (handle.method || key).toLowerCase();
						handle.route = baseRoute + (handle.route || '');
						handle._dirname = dirname;

					if( !inArray(handle.method, ['get', 'post', 'put', 'delete']) ) {
						throw new Error('Unknown route-method in '+key);
					}

					r[handle.method].call(r, handle.route, function(inject, req, res, next, params) {

						var caller = function() {
							return inject(handle, {
								req: req,
								res: res,
								next: next,
								params: params
							});
						};

						if(handleHandler) {
							handleHandler(caller, handle);
						} else {
							caller();
						}

					});

				});

			});

			return r;

		};

	});

};



function inArray (needle, array) {
	return (!!~array.indexOf(needle));
}



