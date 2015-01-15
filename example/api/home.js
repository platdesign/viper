'use strict';

exports.param = 'userId';

exports.getIndex = function(db) {
	return db.model('User').findAll();
};

exports.get = function(db, params, parent) {
	return db.model('User').find(params[exports.param]);
};

exports.login = function() {
	return 'login';
};

exports.rock = function() {
	return 'rock';
};

