'use strict';

var gulp = require('gulp');



// Register sass tasks
var sass = require('pd-gulp-sass-task')(gulp);

sass.register({
	assets: {
		src: './assets/scss/*.scss',
		dest: './public/css'
	}
},{
	watch: {
		watch: './assets/scss/**/*.scss'
	}
});



// Register javascript tasks
var js = require('pd-gulp-js-task')(gulp);

js.register({
	assets: {
		src: './assets/js/*.js',
		dest: './public/js'
	}
});



// Register jade tasks
var jade = require('pd-gulp-jade-task')(gulp);

jade.register({
	index: {
		src: './index.jade',
		dest: './'
	}
});

