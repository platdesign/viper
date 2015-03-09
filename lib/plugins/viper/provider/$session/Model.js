'use strict';

module.exports = {
	connection: 'memory',
	tableName: 'Sessions',

	attributes: {
		sid: {
			type: 'string',
			primaryKey: true,
			unique: true
		},
		data: {
			type: 'json'
		}
	}
};
