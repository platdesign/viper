'use strict';

module.exports = function(viper) {

	var db = viper.sequelize.db;



	viper.router.get('/hello', function(req, res) {

		db.model('User').findAll().then(function(user) {
			res.json(user);
		});

	});

};
