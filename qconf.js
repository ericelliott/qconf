'use strict';

var optimist = require('optimist'),
  processDependencies = require('./lib/process-dependencies.js'),
  makeConfig = require('./lib/make-config.js'),
  q = require('q'),
  loadSource = require('./lib/load-source.js'),

  argv = optimist.argv,

  /**
   * .configure([overrides,] [filePaths]):Object
   * 
   * Creates a config object for your app
   * by reading config settings from a defaults file or list of files,
   * environment variables, command line arguments, and finally
   * a function parameters hash, in reverse priority.
   *
   * @param  {Object} [overrides] A map of config keys and values.
   * @param  {String} [filePaths] Path to the defaults file or list of files in order of precedence (least to most). Can be the only parameter.
   * @return {Object}              An object with .get() and .set().
   */
  configure = function configure(overrides, URIs) {
    var sources = [process.env, argv],
      errors = [],
      dependencies = Array.isArray(overrides) ?
        overrides : undefined,
      config,
      lastArg = arguments[arguments.length - 1],
      cb = (typeof lastArg === 'function') ?
        lastArg : undefined,
      dfd = q.defer();

    // If the first argument is a string, assume
    // arguments is a list of URIs identifying
    // config sources. Else, make sure that it
    // defaults to include config/config.json.
    if (typeof overrides === 'string') {
      URIs = [].slice.call(arguments);
      overrides = {};
    } else if (typeof arguments[1] === 'string') {
      URIs = [].slice.call(arguments, 1);
    } else if ( Array.isArray(arguments[1] )) {
      URIs = arguments[1];
    } else {
      URIs = ['file://config/config.json'];
    }

    // If the first argument is an Array,
    // assume that it is a list of dependencies.
    if ( Array.isArray(overrides) ) {
      processDependencies(dependencies)
          .then(function (sources) {

        config = makeConfig(sources);

        dfd.resolve(config);
        if (cb) {
          return cb(null, config);
        }
      }, function catchErr(err) {
        dfd.reject(config);
        return cb(err);
      });

      return dfd.promise;
    }

    for (var i = 0; i < URIs.length; i++){
      try {
        sources.push(loadSource(URIs[i]));
      } catch (err) {
        errors.push(err);
      }
    }

    // If the first argument is an object,
    // assume that it is a single config overrides
    // object, and append it to sources:
    if (typeof overrides === 'object' &&
        !Array.isArray(overrides)) {
      sources.push(overrides);
    }

    return makeConfig(sources);
  };

module.exports = configure;
