'use strict';


var Store = require('./$session/Store.js');

module.exports = function($dataProvider, $serverProvider) {
	var collectionName = '_sessions';

	$dataProvider.define(collectionName, require('./$session/Model.js'));

	$serverProvider.sessionStore(function($data) {
		var store = new Store({
			db: $data[collectionName]
		});
		return store;
	});

	this.config = function(config) {
		$serverProvider.sessionConfig(config);
		return this;
	};

	this.setConnection = function(name) {
		$dataProvider.editCollection(collectionName, {
			connection: name
		});
		return this;
	};

	this.setTableName = function(name) {
		$dataProvider.editCollection(collectionName, {
			tableName: name
		});
		return this;
	};


	this.$resolver = function() {
		return require('./$session/resolver.js');
	};


	this.$get = function() {
		throw new Error('$session can only be used on requests');
	};
};
