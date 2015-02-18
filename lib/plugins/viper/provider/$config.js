'use strict';


module.exports = function($is, $log, $fs, $cwd, $path, $constructorConfig, $extend, $$instance, $parse) {
	var provider = this;

	var defaultConfig = {
		configPath: './config',
		server: {
			port: 3000,
			session: {
				secret: 'qwe'
			}
		}
	};

	var config = $extend(true, {}, defaultConfig, $constructorConfig);

	var _envConfigPath = $path.resolve($cwd, config.configPath);
	function readEnvConfigFile(envName) {
		var p = $path.join(_envConfigPath, envName+'.js');

		if( $fs.existsSync( p ) ) {
			$log.verbose('Using config from '+envName+'.js');
			return require( p );
		}
		return {};
	}

	$extend(true, config, readEnvConfigFile('global'), readEnvConfigFile($$instance.env()));


	this.get = function(keyPath) {
		return $parse(config, keyPath);
	};

	this.each = function(keyPath, handler) {
		var val = this.get(keyPath);

		if( $is.array(val) ) {
			val.forEach(handler);
		}

		if( $is.object(val) ) {
			Object.keys(val).forEach(function(key) {
				handler(key, val[key]);
			});
		}
	};


	this.$get = function() {
		return {
			get: provider.get
		};
	};

};
