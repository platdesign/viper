'use strict';


var createCustomError = require('../../../tools/createCustomError.js');

module.exports = function($is) {

	var errors = this.errors = {};

	this.createError = function(name, Parent, handler) {
		if( $is.string(Parent) ) {
			if(!errors[Parent]) { throw new Error('Cannot find Error: '+Parent); }
			Parent = errors[Parent];
		}
		errors[name] = createCustomError(name, Parent, handler);
	};

	this.$get = function() {
		return errors;
	};
};


