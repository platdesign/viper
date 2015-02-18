'use strict';


module.exports = {
	array: function(arr) {
		return Array.isArray(arr);
	},
	function: function(obj) {
	  return !!(obj && obj.constructor && obj.call && obj.apply);
	},
	string: function(str) {
		return (typeof str === 'string' || str instanceof String);
	},
	object: function(obj) {
		return (!!obj) && (obj.constructor === Object);
	},
	set: function(val) {
		return (typeof val !== 'undefined');
	},

	compareBooleanArrayWithAnd: function(arr, getBooleanVal) {
		getBooleanVal = getBooleanVal || function(item) { return item; };

		var result = true;

		result = arr.every(function(item) {
			item = getBooleanVal(item);
			return result && item;
		});
		return result;
	},

	compareBooleanArrayWithOr: function(arr, getBooleanVal) {
		getBooleanVal = getBooleanVal || function(item) { return item; };

		var result = false;
		arr.every(function(item) {
			item = getBooleanVal(item);
			if(item === true) {
				result = true;
				return false;
			}
			return true;
		});
		return result;
	}
};
