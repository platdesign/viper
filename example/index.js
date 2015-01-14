'use strict';


var viper = require('../');


var app = viper();




app.plugin( require('./plugins/test.js') );

