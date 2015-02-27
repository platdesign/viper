'use strict';

module.exports = function($err, $req, $res, $errors, $log, $is, $q, $route) {

	var routeDef = $route;

	function invoke(handler, locals) {
		return $req.$invoke(handler, locals);
	}

	// Render error
	$q.fcall(function() {

		if( $is.function( routeDef.renderError ) ) {
			return invoke( routeDef.renderError, { $err: $err } );
		} else if(routeDef.render === 'json' || !routeDef.template) {

			if( $err instanceof $errors.ResponseError ) {
				/**
				 * Render err as json if it is an instance of ResponseError
				 */
				return $res.status($err.status || 400).json($err);
			} else {
				/**
				 * Otherwise render an UnknownError.
				 */
				return $res.status($err.status || 400).json({
					name: 'UnknownError',
					message: 'Unknown error occurred.',
					status: ($err.status || 400)
				});
			}

		} else if ( $is.string(routeDef.template) ) {

			// Do you really want to render the template?
			//
			// Ideas:
			// - errorTemplate
			// - defaultErrorTemplate (maybe as optionSetter on $routeProvider???)
			// - or defaultErrorTemplate by statusCode???

			return $res.status($err.status || 400).render(routeDef.template, { $err: $err });
		}

	})

	// Log error too
	.then(function() {
		$log.error($err);
	})

	// Catch rendering errors
	.catch(function(err) {
		// NOW A REALLY STRICT ERROR OCCURRED IN errorHandler!!! LOG IT!!!!!!!!!!!
		// Log it persistent?!
		$log.error(err);
		$res.send('error');
	});



};
