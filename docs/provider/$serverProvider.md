# $serverProvider



## Methods

### `serveStatic(mixed)`

#### Params

- **mixed** `Object|Array|String`

#### Example

------------------------------------------------------------

### `parser(handler)`


#### Params

- **handler** `Function` Will be invoked by `$injector`.

#### Example

------------------------------------------------------------

### `middleware(handler)`

#### Params

- **handler** `Function` Will be invoked by `$injector`.

#### Example

------------------------------------------------------------

### `rawMiddleware(expressMiddleware)`

#### Params

#### Example

------------------------------------------------------------

### `middlewareCreator(creator)`

#### Params

#### Example

------------------------------------------------------------

### `interceptor(method, path, handler)`

#### Params

- **method** `String` get, post, put, delete
- **path** `string` Url path.
- **handler** `Function` Will be invoked by `$injector`.

#### Example

------------------------------------------------------------

### `route(method, path, handler)`

#### Params
- **method** `String` get, post, put, delete
- **path** `string` Url path.
- **handler** `Function` Will be invoked by `$injector`.

#### Example

------------------------------------------------------------


### `errorHandler(path, handler)`

#### Params

- **path** `string` Url path.
- **handler** `Function` Will be invoked by `$injector`.


#### Example

------------------------------------------------------------

### `resolver(name, handler)`

#### Params

- **name** `String` Passed name will be accessible as a service on `$injector`.
- **handler** `Function` Will be invoked by `$injector`. The result will be the service.


#### Example

------------------------------------------------------------

### `sessionStore(storeCreator)`

will come soon...

------------------------------------------------------------

### `sessionConfig(config)`

will come soon...
