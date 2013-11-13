'use strict';
var stampit = require('stampit'),
  EventEmitter = require('events').EventEmitter,
  dotty = require('dotty'),
  refresh = function refresh(sources, config) {
    return stampit.compose()
      .enclose(function () {
        var factory = stampit(),
            attrs = factory
              .state.apply(factory, 
                sources)
              .create();

        return stampit.extend(this, {
          /**
           * Return the value of the attribute requested.
           * @param  {String} attr The name of the attribute to return.
           * @return {Any} The value of the requested attribute.
           */
          get: function get(attr) {
            var val = dotty.get(attrs, attr);
            if (val === undefined) {
              config.emit('undefined',
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
            return config;
          },

          getAll: function getAll() {
            return attrs;
          },

          attrs: attrs
        });
      }).create();
  };

module.exports = function configure(sources) {
  var config, configData;

  config = stampit.convertConstructor(EventEmitter).
    methods({
      get: function () {
        var args = [].slice.call(arguments);
        return configData.get.apply(null, args);
      },
      refresh: function (sources) {
        this.emit('refresh', sources);
        return refresh(sources, this);
      }
    }).create();

  configData = refresh(sources, config);

  return config;
};
