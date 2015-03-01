'use strict';


module.exports = function($errorsProvider) {

	$errorsProvider.createError('ResponseError', null, function(status, msg) {

		if(status && !msg) {
			msg = status;
			status = 400;
		}
		this.message = msg;
		this.status = status;

	});


	$errorsProvider.createError('PermissionError', 'ResponseError', function(msg, route) {
		this.status = 401;
		this.message = msg;
		this.route = route;
	});



};
