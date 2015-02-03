'use strict';

var express = require('express');

var path = require('path');
var defaults = {
	configId: 'statics'
};



module.exports = function () {

	this.service('serveStatic', function(app){
		return function(route, dir) {
			app.use(route, express.static(dir));
		};
	});

	var that = this;

	if( this._config[defaults.configId] ) {
		var config = this._config[defaults.configId];

		this.config(function(app) {

			config.forEach(function(item) {

				// If item is a string
				if(typeof item === 'string') {
					app.use(express.static( path.resolve(that.cwd(), item) ));

				// If item is an object like:
				// { baseRoute: '/public', path: './publicDir' }
				} else if (item !== null && typeof item === 'object') {
					if( item.baseRoute && item.path ) {
						app.use(item.baseRoute, express.static( path.resolve(that.cwd(), item.path) ));
					}
				}

			});


			app.use(express.static(__dirname + '/public'));
		});

	}

};

