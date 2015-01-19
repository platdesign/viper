'use strict';

module.exports = function(con, types) {

	var Model = con.define('Product', {
		title: types.STRING
	});

	return Model;

};
