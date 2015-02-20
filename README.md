#Viper



## Install

	npm install --save viper


## [Docs](http://platdesign.github.io/viper/#/docs)
	
## Basic usage

	var viper = require('viper');
	
	var app = viper();
	
	app.plugin(function() {
		
		// Define services
		this.service('helloWorld', function() {
			return function helloWorld(name) {
				return 'Hello '+(name || 'World');
			};
		});
		
		// Define providers
		this.provider('myDataCon', function(){
			
			var db = // create database-connection
			
						
			// return a service-function wich will be 
			// injected when requested as a service. 
			return function(){
				return db;
			};
			
		});
		
		// Use config methods for middleware 
		// like session/cookie/etc - handling
		this.config(function(app){
			app.use(...);
		});
		
		// Use run methods for route definitions
		this.run(function(router, helloWorld){
			router.get('/helloWorld', function(req, res){
				res.send( helloWorld('Peter') );
			})
		});
				
	});
	
	// use plugins from external files or npm modules
	app.plugin( require('path/to/plugin/or/npm-module-name') );
	
	
	// bootstrap your viper-application
	// should be the last call in your file.
	// Plugins which will be registred after this, won't be available.
	app.bootstrap();
	
	
	