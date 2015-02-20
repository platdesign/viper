# $errorsProvider

## Methods

### `createError(name, Parent, initializer)`

Creates/extends a custom error class.

#### Params

- **name** `String` Name for the error class. e.g. `ResponseError`, `AuthError`, etc.

- **Parent** `Class|String` In some situations it is important to inherit from another Error class. For example [$serverProvider](#/docs/provider/$serverProvider) uses the `ResponseError` to decide which information will be displayed to the client when there are errors until rendering. By default (or *null*) `Parent` === `Error`. To extend a defined error class pass the name of the error as a String.

- **initializer** `Function` Closure will be called on error scope with arguments of constructor. Could be used to pass additional information to an error. (e.g. HTTP-Status-Code on ResponseError)

