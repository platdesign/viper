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
		$extend
	) {

	var provider = this;

	provider.routes = {};

	function methodHandler (method) {
		return function() {
			$serverProvider[method].apply($serverProvider, arguments);
		};
	}

	this.get 	= methodHandler('get');
	this.post 	= methodHandler('post');
	this.put 	= methodHandler('put');
	this.delete = methodHandler('delete');
	this.use 	= methodHandler('use');




	this.route = function(routeDef, parentUrl) {
		if($is.array( routeDef )) {
			routeDef.forEach(function(def) {
				provider.route(def, parentUrl);
			});
		} else if( $is.object(routeDef) ) {


			routeDef.url = ((parentUrl && parentUrl!=='/')?parentUrl:'')+routeDef.url;

			if(routeDef.routes) {
				this.route(routeDef.routes, routeDef.url);
			}




			require('./$route/route.js')(routeDef, $q, $log, $errorsProvider, $path, $cwd, $fs, $is, $extend, $serverProvider, provider);

		}

		return this;
	};

	$serverProvider.errorHandler(require('./$route/errorHandler.js'));

	this.$get = function() {
		return 'router';
	};

};
