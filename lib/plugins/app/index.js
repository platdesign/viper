'use strict';

var express = require('express');

var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

module.exports = function() {
	var that = this;

	this.value('Router', express.Router);

	this.provider('app', function() {

		var app = express();

		return function() {
			return app;
		};

	});

	this.config(function(app) {

		that.logVerbose('Using morgan in dev mode');
		app.use(morgan('dev'));

		that.logVerbose('Using cookie parser');
		app.use(cookieParser());

		that.logVerbose('Using bodyParser urlencoded (for application/x-www-form-urlencoded)');
		app.use(bodyParser.urlencoded({ extended: false }));

		that.logVerbose('Using bodyParser json (for application/json)');
		app.use(bodyParser.json());

		that.logVerbose('Using gzip compression');
		app.use(compression());

	});

}
