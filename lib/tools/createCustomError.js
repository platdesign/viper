'use strict';



/**
 * Create custom error constructor
 * @author  Christian Blaschke <mail@platdesign.de>
 *
 * @param  {string} name			Name of error (this.name)
 * @param  {Constructor} Parent		Optional parent constructor for inheritance. Default: global.Error
 * @param  {closure} initializer	Optional closure which will be invoked on instance and inherited from parent
 * @return {Constructor}			Returns constructor for custom error
 */
function createCustomError(name, Parent, initializer) {
	Parent = Parent || Error;

	function Err(msg) {
		// Capture stack trace
		Error.captureStackTrace(this, this.constructor);


		this.name = name;
		this.message = msg;

		// invoke initializer if set
		if(this.__initializer) {
			this.__initializer.apply(this, arguments);
		}
	}

	// inherit from parents prototype
	Err.prototype = new Parent();

	// re-set constructor
	Err.prototype.constructor = Err;

	// Set initializer for inheritance
	if(initializer) {
		Err.prototype.__initializer = initializer;
	}

	return Err;
}

module.exports = createCustomError;
