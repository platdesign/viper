'use strict';


require('ui-router');

var app = angular.module('app', [
	'ui.router'
]);




app.config( require('./app/config.js') );
app.config( require('./app/states.js') );


// IMPORTANT to start stateProvider (cause we ng-include the first ui-view - see index.html)
app.run(['$state', function(){}]);

$(document).ready(function() {
	angular.bootstrap($('body'), [app.name]);
});
