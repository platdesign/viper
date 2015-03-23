'use strict';


module.exports = function($dataProvider, $configProvider, $fs, $cwd, $path) {

	$configProvider.each('$data.connections', function(name, config) {
		$dataProvider.connection(name, config);
	});

	var _mPath = $configProvider.get('$data.modelsPath');

	if(_mPath) {
		var modelsPath = $path.resolve($cwd, $configProvider.get('$data.modelsPath'));

		if( $fs.existsSync(modelsPath) ) {
			$fs.readdirSync(modelsPath).forEach(function(item) {
				var itemPath = $path.join(modelsPath, item);

				var stats = $fs.statSync(itemPath);

				if(stats.isFile()) {
					var def = require( $path.join(modelsPath, item) );
					$dataProvider.define(item, def);
				}

			});
		}
	}



};
