#Mumbee

##Basic config

	// Require mumbee
	var mumbee = require('mumbee');

	// create new instance
	var app = mumbee();
	
	// Bootstrap the app
	app.bootstrap();


##Instance-Methods


### - loadPluginFromPath( *pathToPlugin* )
Loads a plugin from the given path.

### - loadPluginsFromDir( *pathToPluginsDir* )
Loads each plugin from a given directory.

### - loadNpmPlugin( *moduleName* )
Load a npm-module as plugin.

### - loadNpmPlugins( *listOfNpmModuleNames* )
Load multiple npm-modules as plugins with one command.


### - bootstrap( )
Initializes the application an starts the server.
