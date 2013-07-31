qconf
=====

Painless configuration for Node apps with defaults file, environment variables, arguments, function parameters.

defaults file < process.env < command line arguments < function call override

## Getting started

Create your config object:
```
var qconf = require('../qconf.js'),
  config = qconf(); // 99% of the time, this is all you need!
```

### Extra credit

Create a JSON file: `./config/config.json`

```
{
  "default_setting": true,
  "envOverride": false,
  "arg_override": false,
  "param_override": false
}
```

Maybe source some environment variables:

```
export env_override=true
```

Try a command-line option:
```
node myfile.js --arg-option true
```

## Result

Painless configuration for your apps!


## Motivation

Got sick of the complexity of nconf. Don't try to be everything to everybody. Just get a simple job done with simple code.

## API

### qconf() ###

This is the function that gets imported when you require qconf.

Creates a configuration singleton object for your app
by reading configuration settings from a defaults file,
environment variables, command line arguments, and finally
a function parameters hash, in reverse priority.

* @param  {Object} [overrides] A map of config keys and values.
* @param  {String} [defaultsPath] Path to the defaults file. Can be the only parameter.
* @return {Object} config A configuration object.
* @return {Function} config.get The get method

### qconf.clear() ###

Clear the existing configuration. This is typically used to clear out any settings prior to reloading configuration with a subsequent call to `qconf()`.


## The config object ##

The config object is the object returned when you call `qconf()`. This is the getter and setter for all your app's environment variables.

### config.get() ###

Return the value of the attribute requested.

* @param {String} attr The name of the attribute to return.
* @return {Any} The value of the requested attribute.

### config.set() ###

Set the value of an attribute.

* @param {String} attr The name of the attribute to set.
* @param {Any} value The value to set the attribute to.
* @return {Object} The config object (for chaining).


## Events ##

The config object is an event emitter.

## undefined ##

`config.get()` will emit the event 'undefined' if the value of the variable in question is `undefined`. It will also emit a convenient, searchable message that you can log and easily find in your logs:

***'WARNING: Undefined environment variable: ' + `attr`**

`attr` refers to the name of the variable you tried to get.
