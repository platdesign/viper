'use strict';

var slashPlaceholder = '###slash###';


var routeString = module.exports = {};


routeString.sanitize = function(url) {
	// add / at beginning if not exists
	if(url.substr(0, 1) !== '/') {
		url = '/'+url;
	}

	// remove multiple slashes
	url = url.replace(/\/{2,}/g, '/');

	return url;
};

routeString.getSegments = function(url) {
	var segments = [];

	url = this.sanitize(url);
	url = url.replace('\\/', slashPlaceholder);

	url.split('/').forEach(function(seg) {
		if(seg) {
			var segment = seg.replace(slashPlaceholder, '\\/');
			segments.push(segment);
		}
	});

	return segments;
};

routeString.getSegmentsPaths = function(url) {
	var parents = ['/'];

	var segments = this.getSegments(url);

	var tmpSegs = [];
	segments.forEach(function(seg) {
		tmpSegs.push(seg);
		parents.push('/'+tmpSegs.join('/'));
	});

	return parents;
};


