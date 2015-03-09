'use strict';


module.exports = function($sessionProvider, $serverProvider) {

	// Register $session resolver
	$serverProvider.resolver('$session', $sessionProvider.$resolver());

};
