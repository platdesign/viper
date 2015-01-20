'use strict';

exports.get = function(req) {

	return {
		user: req.user.setNewPassword('qweqweqwe', 'qweqweqwe')
	}

}
