# $configProvider

## Methods

### `get(configPath)`


#### Params

- **configPath** `String` Path to position of required config. String will be [$parsed](#/docs/tools) on main config object.

#### Returns `String|Array|Object|Int|Bool`

Will return the requested information or null.

#### Example

In your config/global.js

```json
{	
	server: {
		port: 3333
	}
}
```

Request `server.port` in a config handler:

```javascript
app.config(function($configProvider){
	$configProvider.get('server.port'); // Will return 3333
});
```

-----------------------------------------------------------

### `each(configPath, itemHandler)`

#### Params
- **configPath** `String` See at `get(configPath)`
- **itemHandler** `Function` Closure wich will be executed on each item.


#### Example
In your config/global.js

```json
{	
	myService: {
		configA: {
			name: 'A'
		},
		configB: {
			name: 'B'
		}
	}
}
```

Walk each item of `myService`-config:

```javascript
app.config(function($configProvider){
	$configProvider.each('myService', function(key, val){
		...
	});
});
```

