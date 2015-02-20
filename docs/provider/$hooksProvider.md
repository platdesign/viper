# $hooksProvider

Hooks are a powerfull tool to:

- trigger handlers (like events) of third party plugins
- suspend into a call stack of promises


## Methods

### `registerHook(name, handler)`


#### Params
- **name** `String` Name of the hook which has to be executed to call the handler.
- **handler** `Function` Will be invoked by `$injector`.

#### Example

```javascript
app.config(function($hooksProvider){
	$hooksProvider.registerHook('test', function($hook) {
		console.log($hook.data);
	});
});

app.run(function($hooks){
	$hooks.execute('test', { qwe:123 });
});
```

Read more about [$hooks](#/docs/service/$hooks)-service.

------------------------------------------------------------