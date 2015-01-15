'use strict';


exports.param = 'commentId';


exports.getIndex = function(db, params) {
	return db.model('User').findAll();
};


exports.get = function(db, params, parent) {
	return parent.get();
	return db.model('User').find(params.commentId);
};

