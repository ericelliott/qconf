var optimist = require('optimist'),
  stampit = require('stampit'),
  EventEmitter = require('events').EventEmitter,
  loadSource = require('./lib/load-source'),

  argv = optimist.argv,
  configuration,
  events = stampit.convertConstructor(EventEmitter),

  /**
   * .configure([overrides,] [filePaths]):Object
   * 
   * Creates a configuration singleton object for your app
   * by reading configuration settings from a defaults file or list of files,
   * environment variables, command line arguments, and finally
   * a function parameters hash, in reverse priority.
   *
   * @param  {Object} [overrides] A map of config keys and values.
   * @param  {String} [filePaths] Path to the defaults file or list of files in order of precedence (least to most). Can be the only parameter.
   * @return {Object}              An object with .get() and .set().
   */
  configure = function configure(overrides, filePaths) {
    var defaults = [],
        errors = [];

    if (configuration) {
      return configuration;
    }

    if (Array.isArray(overrides) || typeof overrides === 'string') {
      filePaths = overrides;
      overrides = {};
    }

    if (!(Array.isArray(filePaths) && filePaths.length)) {
      if (typeof filePaths === 'string') {
        filePaths = [filePaths];
      }
      else {
        filePaths = ['config/config.json'];
      }
    }

    for (var i = 0; i < filePaths.length; i++){
      try {
        defaults.push(loadSource(filePaths[i]));
      } catch (err) {
        errors.push(err);
      }
    }

    configuration = stampit.compose(events)
      .enclose(function () {
        var factory = stampit(),
            attrs = factory
              .state.apply(factory, defaults.concat(process.env, argv, overrides))
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

    if (errors.length) {
      configuration.errors = errors;
    }

    return configuration;
  };

configure.clear = function clear() {
  configuration = undefined;
};

module.exports = configure;
