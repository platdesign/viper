'use strict';

var BaseStore = require('express-session').Store;
var util = require('util');

function WaterlineStore(options) {
	options = options || {};

	if (!options.db) {
		throw new Error('Waterline collection is required');
	}
	BaseStore.call(this, options);

	this.db = options.db;
}

module.exports = WaterlineStore;

util.inherits(WaterlineStore, BaseStore);

var proto = WaterlineStore.prototype;


proto.get = function getSession(sid, fn) {

	this.db.findOne(sid)
	.then(function(session) {
		if(!session) {
			return fn();
		}
		fn(null, session.data);
	}).catch(function(error) {
		fn(error);
	});
};



proto.set = function setSession(sid, data, fn) {
	console.log('session set ');

	var db = this.db;

	this.db.findOne(sid)
	.then(function(session) {
		if(!session) {
			return db.create({ sid: sid, data: data });
		} else {
			session.data = data;
			return session.save();
		}
	})
	.then(function(session) {
		fn(null, session.data);
	})
	.catch(function(err) {
		fn(err);
	});

};

proto.destroy = function destroySession(sid, fn) {
	console.log('session destroy');


	this.db.findOne(sid)
	.then(function(session) {
		if(session) {
			return session.destroy();
		}
	})
	.then(function() {
		fn();
	})
	.catch(function(err) {
		fn(err);
	});

};

proto.length = function calcLength(fn) {
	console.log('session length');

	this.db.count()
	.then(function(result) {
		fn(null, result);
	})
	.catch(function (err) {
		fn(err);
	});
};

