'use strict';


module.exports = function($q, $log) {
	var connections = {};
	var onConnected = {};


	this.connect = function(name, connector) {
		if( connections.hasOwnProperty(name) ) {
			throw new Error('Database connection '+name.green+' already exists.');
		}

		$log.verbose('Database connection '+name.green+' initialized');

		connections[name] = $q.when( connector() )
			.then(function(con) {
				$log.verbose('Connection '+name.green+' has been established successfully.');
				return con;
			}, function(err) {
				$log.error('Connection '+name.green+' failed.');
				throw err;
			})
			.then(function(con) {
				var items = onConnected[name] || [];
				var promises = [];
				items.forEach(function(handler) {
					promises.push( handler(con) );
				});
				return $q.all(promises)
				.then(function(){
					return con;
				});
			});
	};


	this.onConnected = function(name, handler) {
		onConnected[name] = onConnected[name] || [];
		onConnected[name].push(handler);
		return this;
	};


	this.$get = function() {
		return $q.promiseFromHash(connections);
	};
};
