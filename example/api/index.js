'use strict';


exports.post = function(db) {
	return db.model('User').findAll();
};


