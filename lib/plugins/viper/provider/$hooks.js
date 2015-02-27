'use strict';


module.exports = function($log, $q) {

	var hooks = {};
	this.registerHook = function(name, handler) {
		hooks[name] = hooks[name] || [];
		hooks[name].push(handler);
		$log.verbose('Hook registered: '+name);
	};



	this.$get = function($injector, $q) {
		return {
			execute: function(name, data, locals, scope, _$injector) {
				_$injector = _$injector || $injector;

				return $q.fcall(function() {
					if(hooks[name]) {
						var hks = hooks[name];

						locals = locals || {};
						locals.$hook = {
							data: data || {}
						};



						var successCounter=0;

						var logResults = function() {
							$log.verbose(successCounter + '/'+hks.length+' Hook(s) successfully executed for '+name);
						};

						return hks.reduce(function (soFar, hook) {
							return $q.when(soFar).then(function() {
								return _$injector.invoke(hook, locals, scope)
								.then(function() {
									successCounter++;
								});
							});
						}, $q(true))

						.then(function() {
							logResults();
						})
						.catch(function(err) {
							logResults();
							throw err;
						});



					}
				});

			}
		};
	};


};
