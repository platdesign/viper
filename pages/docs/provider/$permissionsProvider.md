# $permissionsProvider



`$permissionsProvider` handles permissions on routes.

## Usage

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




## `Role` parameters

- **name** - {String} - Name of the role

- **negatedName** - {String} - Each role can be used negated with a `!` as prefix of role name. To display a custom negated role name in errors or to use a custom negated role name in permissions definition on a route provide a `negatedName`. Example: If you define a role `hasCat` you can use it in role permissions with following strings: `hasCat`, `!hasCat`, `notHasCat`. Name of `notHasCat` can be customized by `negatedName`.

- **resolve** - {Function} - Will be invoked and has to return a boolean or promise, which resolves with a boolean.

- **message** - {String} - Message which will be the message of `PermissionsError` if role does not match but must.

- **negatedMessage** - {String} - Message which will be the message of `PermissionsError` if role matches but must not.



## Methods


### `defineRole()`

Defines a `role` and registeres it. This method has multiple signatures:

- **`defineRole(name, resolve, role)`**

	- **name** - Sets `role.name`
	- **resolve** - Sets `role.resolve`
	- **role** - Extends `role`


- **`defineRole(name, role)`**

	- **name** - Sets `role.name`
	- **role** - Extends `role`

- **`defineRole(role)`**

	- **role** - Defines `role` object.



