var fs = require('fs'),
  forOwn = require('mout/object/forown'),
  mixIn = require('mout/object/mixin'),
  optimist = require('optimist'),
  stampit = require('stampit'),

  argv = optimist.argv,
  configuration,

  /**
   * Creates a configuration singleton object for your app
   * by reading configuration settings from a defaults file,
   * environment variables, command line arguments, and finally
   * a function parameters hash, in reverse priority.
   *
   * @param  {Object} overrides    A map of config keys and values.
   * @param  {String} [defaultsPath] Path to the default config file.
   * @return {Object}              An object with .get() and .set().
   */
  configure = function configure(overrides, defaultsPath) {
    var defaults,
      file = __dirname + (defaultsPath || '/config/config.json'),
      defaultError;

    if (configuration) {
      return configuration;
    }

    try {
      defaults = JSON.parse( fs.readFileSync(file, 'utf8') );
    } catch (err) {
      defaultError = err;
    }

    configuration = stampit()
      .enclose(function () {
        var attrs = stampit()
          .state(defaults)
          .state( JSON.parse(JSON.stringify(process.env)) )
          .state( JSON.parse(JSON.stringify(argv)) )
          .state( JSON.parse(JSON.stringify(overrides)) )
          .create();

        return stampit.extend(this, {
          get: function get(attr) {
            return attrs[attr];
          },
          set: function set(attr, value) {
            if (!attr) {
              return;
            }

            attrs[attr] = value;
            return this;
          }
        });
      }).create();

    return configuration;
  };

module.exports = configure;
