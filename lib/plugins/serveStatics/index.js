'use strict';

var express = require('express');

var path = require('path');
var defaults = {
	configId: 'statics'
};



module.exports = function () {

	var that = this;

	this.service('serveStatic', function(app){
		return function(route, dir) {
			that.logVerbose('Serving static files from '+ dir + ' ['+route+']');
			app.use(route, express.static(dir));
		};
	});



	if( this._config[defaults.configId] ) {
		var config = this._config[defaults.configId];

		this.config(function(app, serveStatic) {

			config.forEach(function(item) {

				// If item is a string
				if(typeof item === 'string') {

					serveStatic('/', path.resolve(that.cwd(), item) );

				// If item is an object like:
				// { baseRoute: '/public', path: './publicDir' }
				} else if (item !== null && typeof item === 'object') {
					if( item.baseRoute && item.path ) {
						serveStatic( item.baseRoute, path.resolve(that.cwd(), item.path) );
					}
				}

			});

		});

	}

};

