qconf
=====

Painless configuration with defaults file, environment variables, arguments, function parameters.

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
