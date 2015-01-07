#Viper corePlugins

##coreConfig

###options

- **path** [default: `./config`]

##coreLogger

CoreLogger embeds [morgan](https://github.com/expressjs/morgan) in your project.
By default coreLogger selects `dev`-pattern in development environment and `combined` in production. With a given `pattern` in the options, coreLogger will use it in each environment. 

###options

- **pattern**
	
	pattern: ['common'|'combined'|'dev'|'short'|'tiny']

	For more information have a look at the docs of [morgan](https://github.com/expressjs/morgan).