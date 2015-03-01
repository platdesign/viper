# Install

## 1. Get library
Create a new project and install viper via [npm](https://www.npmjs.com/).

`npm install --save viper`


## 2. Create app
Create a new file (e.g. `app.js`) at the root of your project.

```javascript
// Require library
var viper = require('viper');

// Create app instance
var app = viper();

// Configure your app here
// ...

// Bootstrap your app
app.bootstrap();

```

## 3. Start app

Finally start app with:

`node app.js` (or `node` + *custom file name*)

---

## Install plugins

Viper can handle plugins. A plugin is 'only' a function which is executed on the scope of the app isntance.

### 1. Get plugin
`npm install --save [viper-plugin]` (replace `[viper-plugin]` with the name of the plugin)

### 2. Load plugin on app

```javascript
app.plugin( require('[viper-plugin]') );
```

That's it! 
