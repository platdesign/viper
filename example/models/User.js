'use strict';

module.exports = function(con, types) {

	var Model = con.define('User', {
		username: types.STRING
	});

	return Model;

};
