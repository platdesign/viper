'use strict';

var Q = module.exports = require('q');



var promiseFromHash = function(hash) {
	var promises = [];
	Object.keys(hash).forEach(function(key) {
		promises.push(
			Q.when(hash[key])
			.then(function(val) {
				return {
					key: key,
					val: val
				};
			})
		);
	});

	return Q.allSettled(promises).then(function(results) {
		var obj = {};
		results.forEach(function(item) {

			if(item.state === 'fulfilled') {
				obj[item.value.key] = item.value.val;
			} else {
				throw item.reason;
			}

		});
		return obj;
	});
};



Q.promiseFromHash = promiseFromHash;

