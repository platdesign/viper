'use strict';



var Waterline = require('waterline');

var adapters = {
	mysql: require('sails-mysql'),
	mongo: require('sails-mongo'),
	memory: require('sails-memory')
};

module.exports = function($extend) {

	var cDefs = {};
	this.define = function(name, config) {
		config.identity = config.identity || name;
		cDefs[name] = config;
		return this;
	};


	this.editCollection = function(name, config) {
		if(cDefs[name]) {
			$extend(true, cDefs[name], config);
		} else {
			throw new Error('Collection \''+name+'\' not found');
		}
		return this;
	};

	this.registerAdapter = function(name, adapter) {
		adapters[name] = adapter;
		return this;
	};

	var connections = {};
	this.connection = function(name, config) {
		connections[name] = config;
		return this;
	};


	this.connection('memory', {
		adapter: 'memory'
	});


	this.$get = function($q) {

		var instance = new Waterline();

		Object.keys(cDefs).forEach(function(key){
			var coll = Waterline.Collection.extend(cDefs[key]);
			instance.loadCollection(coll);
		});

		var config = {
			adapters: adapters,
			connections: connections
		};

		return $q.Promise(function(resolve, reject) {
			instance.initialize(config, function(err, models) {
				if(err) {
					return reject(err);
				}

				var data = function(collName) {
					return data[collName];
				};

				Object.keys(models.collections).forEach(function(key) {
					data[key] = models.collections[key];
				});

				data.connections = models.connections;

				resolve(data);
			});
		});

	};

};
