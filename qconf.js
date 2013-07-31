var fs = require('fs'),
  path = require('path'),
  optimist = require('optimist'),
  stampit = require('stampit'),
  EventEmitter = require('events').EventEmitter,

  argv = optimist.argv,
  configuration,
  events = stampit.convertConstructor(EventEmitter),

  /**
   * .configure([overrides,] [defaultsPath]):Object
   * 
   * Creates a configuration singleton object for your app
   * by reading configuration settings from a defaults file,
   * environment variables, command line arguments, and finally
   * a function parameters hash, in reverse priority.
   *
   * @param  {Object} [overrides] A map of config keys and values.
   * @param  {String} [defaultsPath] Path to the defaults file. Can be the only parameter.
   * @return {Object}              An object with .get() and .set().
   */
  configure = function configure(overrides, defaultsPath) {
    var defaults,
      pathString = (typeof overrides === 'string') ? overrides : defaultsPath,
      file = pathString && path.resolve(pathString) ||
        path.resolve(process.cwd() + '/config/config.json'),
      defaultError;

    if (configuration) {
      return configuration;
    }

    try {
      defaults = JSON.parse( fs.readFileSync(file, 'utf8') );
    } catch (err) {
      defaultError = err;
    }

    configuration = stampit.compose(events)
      .enclose(function () {
        var attrs = stampit()
          .state(defaults, process.env, argv, overrides)
          .create();

        return stampit.extend(this, {
          /**
           * Return the value of the attribute requested.
           * @param  {String} attr The name of the attribute to return.
           * @return {Any} The value of the requested attribute.
           */
          get: function get(attr) {
            var val = attrs[attr];
            if (val === undefined) {
              this.emit('undefined',
                'WARNING: Undefined environment variable: ' + attr, attr);
            }
            return val;
          },
          /**
           * Set the value of an attribute.
           * @param {String} attr  The name of the attribute to set.
           * @param {Any} value The value to set the attribute to.
           * @return {Object} The config object (for chaining).
           */
          set: function set(attr, value) {
            if (!attr) {
              return;
            }

            attrs[attr] = value;
            return this;
          }
        });
      }).create();

    if (defaultError) {
      configuration.defaultError = defaultError;
    }

    return configuration;
  };

configure.clear = function clear() {
  configuration = undefined;
};

module.exports = configure;
