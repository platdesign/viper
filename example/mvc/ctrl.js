'use strict';

exports.get = function(db, req) {
	return {
		account: req.user
	}
};





exports.post = function(db) {
	return {
		users: db.model('User').findAll(),
		products: db.model('Product').findAll()
	}
};

exports.post.view = 'post.jade';
