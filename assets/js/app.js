'use strict';

var $ = global.jQuery = global.$ = require('jquery');
require('angular');


var angular = global.angular;

// marked
global.marked = require('../../vendor/marked/lib/marked.js');
// hc.marked
require('../../vendor/angular-marked/angular-marked.js');


// ui.router
require('ui-router');



var app = angular.module('app', [
	'ui.router',
	'hc.marked'
]);


app.config( require('./app/config.js') );
app.config( require('./app/states.js') );
app.service( 'pages', require('./app/service/pages.js') );

app.directive('highlight', [function(){

	return {
		restrict: 'A',
		link: function(scope, el) {

			el.find('pre code').each(function(i, block) {
				global.hljs.highlightBlock(block);
			});

		}
	};
}]);

// IMPORTANT to start stateProvider (cause we ng-include the first ui-view - see index.html)
app.run(['$state', function(){}]);

angular.bootstrap($('body'), [app.name]);

