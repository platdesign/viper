# $routeProvider

Use `$routeProvider` to register routes on your application.

## Methods

### `route([config])`

Registers a route handler on [$serverProvider](#/docs/provider/$serverProvider). `config` parameter can be an array of config objects.

#### Params

- **config** `Object` Describes a route with following properties: 
	- **url** - {String} - Url path using parameter syntax from express.js
	- **template** - {String} - Path to template file which will be rendered. If not defined, route will be rendered as JSON-String.
	- **controller** - {Function} - Controller will be invoked by `$injector`. Result of controller will be the `$scope`-Object for rendering. If result is a promise, it will be resolved before rendering starts. 
	- **render** - {Function} - Custom render function.
	- **interceptor** - {Function} - Register route specific interceptor.
	- **resolve** - {Object} - Each item of this object has to be a function, which will be executed and resolved (if it returns promise) before controller is invoked.


#### Example

	app.config(function($routeProvider) {
		
		$routeProvider.route({
			url: '/about',
			template: './views/about.jade',
			resolve: {
				about: function() {
					return {
						name: 'Hans',
						email: 'hans@example.com'
					};
				}
			},
			controller: function($scope, about) {
				$scope.about = about;
			}
		});
		
	});

