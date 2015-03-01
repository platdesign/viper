# $routeProvider

Use `$routeProvider` to register routes on your application.

## Methods

### `route([config])`

Registers a route handler on [$serverProvider](#/docs/serverProvider). `config` parameter can be an array of config objects.

#### Params

- **config** `Object` Describes a route with following properties: 

	- **url** - {String} - Url path using parameter syntax from express.js

	- **template** - {String} - Path to template file which will be rendered. If not defined, route will be rendered as JSON-String.

	- **controller** - {Function} - Controller will be invoked by `$injector`. Result of controller will be the `$scope`-Object for rendering. If result is a promise, it will be resolved before rendering starts. 

	- **render** - {Function} - Custom render function.

	- **interceptor** - {Function} - Register route specific interceptor.

	- **resolve** - {Object} - Each item of this object has to be a function, which will be executed and resolved (if it returns promise) before controller is invoked.

	- **permissions** - {Object} - Define permission roles. Used roles have to be defined on [$permissionsProvider](#/docs/permissionsProvider).
		
		- **only** - {String|Array} - *One of given roles* has to match (resolve === true)
		- **except** - {String|Array} - *Each of given roles* must not match (resolve === false)
		- **inherit** - {Boolean} - Default: true - If false, permissions of parent routes will not affect the permissions of this route.

	- **abstract** - {Boolean} - If true, the defined route can't be executed directly and will throw `ResponseError(404, 'Not found')`.
	
	- **routes** - {Object|Array} - Defined routes in this area will be registered as new routes. The url of each subroute will be prefixed with the url of this route.

	

#### Examples

##### Simple usage
```javascript
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
```


##### Subroutes

```javascript
app.config(function($routeProvider) {
	$routeProvider.route({
		url: '/names',
		resolve: {
			names: function(){
				return ['Peter', 'Hans', 'Robert']
			}
		},
		controller: function(names) {
			return names;
		},
		routes: [
			{
				url: '/:nameIndex',
				controller: function(names, $req) {
					return names[$req.params.nameIndex];
				}
			}
		]
	});
});
```

##### Permissions

For more information on permissions and roles read the docs of [$permissionsProvider](#/docs/permissionsProvider).

```javascript
app.config(function($routeProvider, $permissionsProvider) {

	$permissionsProvider.defineRole('hasCat', function(user){
		return !!user.cat;
	});

	$routeProvider.route({
		url: '/user',
		resolve: {
			user: function(){
				return {
					username: 'Peter',
					cat: 'Whisky'
				}
			}
		},
		controller: function(user) {
			return user;
		},
		permissions: {
			only: 'hasCat'
		}
	});
});
```


